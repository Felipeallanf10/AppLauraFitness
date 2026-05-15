import { useCallback, useState } from 'react'
import {
  supabase,
  supabaseConfigured,
  supabaseLastSyncStorageKey,
  supabaseProfileId,
  supabaseSettingsKeys,
} from '../lib/supabase'

const readLastSync = () => {
  try {
    return localStorage.getItem(supabaseLastSyncStorageKey) || ''
  } catch (err) {
    console.warn('Não foi possível ler o último sync', err)
    return ''
  }
}

const writeLastSync = (value) => {
  try {
    localStorage.setItem(supabaseLastSyncStorageKey, value)
  } catch (err) {
    console.warn('Não foi possível salvar o último sync', err)
  }
}

const buildPayload = (snapshot, timestamp) =>
  Object.entries(snapshot).map(([key, value]) => ({
    profile_id: supabaseProfileId,
    key,
    value,
    updated_at: timestamp,
  }))

const getRemoteSnapshot = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('key,value,updated_at')
    .eq('profile_id', supabaseProfileId)

  if (error) throw error

  const snapshot = {}
  let latestUpdatedAt = ''

  for (const row of data ?? []) {
    snapshot[row.key] = row.value
    if (!latestUpdatedAt || row.updated_at > latestUpdatedAt) {
      latestUpdatedAt = row.updated_at
    }
  }

  return {
    snapshot,
    latestUpdatedAt,
    count: data?.length ?? 0,
  }
}

export function useSupabaseSync({
  completedExercises,
  expandedMeals,
  selectedWorkout,
  setCompletedExercises,
  setExpandedMeals,
  setSelectedWorkout,
}) {
  const [syncStatus, setSyncStatus] = useState('idle')
  const [syncDetail, setSyncDetail] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState(() => readLastSync())

  const applySnapshot = useCallback(
    (snapshot) => {
      if (snapshot.completedExercises) {
        setCompletedExercises(snapshot.completedExercises)
      }

      if (snapshot.expandedMeals) {
        setExpandedMeals(snapshot.expandedMeals)
      }

      if (snapshot.selectedWorkout) {
        setSelectedWorkout(Number(snapshot.selectedWorkout))
      }
    },
    [setCompletedExercises, setExpandedMeals, setSelectedWorkout],
  )

  const pushToSupabase = useCallback(async () => {
    if (!supabaseConfigured || !supabase) {
      return { ok: false, message: 'Supabase não configurado.' }
    }

    setSyncStatus('pushing')
    setSyncDetail('Enviando estado atual para o Supabase...')

    try {
      const timestamp = new Date().toISOString()
      const payload = buildPayload(
        {
          [supabaseSettingsKeys.completedExercises]: completedExercises,
          [supabaseSettingsKeys.expandedMeals]: expandedMeals,
          [supabaseSettingsKeys.selectedWorkout]: selectedWorkout,
        },
        timestamp,
      )

      const { error } = await supabase.from('settings').upsert(payload, {
        onConflict: 'profile_id,key',
      })

      if (error) throw error

      writeLastSync(timestamp)
      setLastSyncedAt(timestamp)
      setSyncStatus('idle')
      setSyncDetail('Estado enviado com sucesso para o Supabase.')

      return { ok: true, message: 'Estado enviado com sucesso.' }
    } catch (error) {
      setSyncStatus('error')
      setSyncDetail(error?.message || 'Falha ao enviar estado para o Supabase.')
      return { ok: false, message: error?.message || 'Falha ao enviar estado.' }
    }
  }, [completedExercises, expandedMeals, selectedWorkout])

  const pullFromSupabase = useCallback(async () => {
    if (!supabaseConfigured || !supabase) {
      return { ok: false, message: 'Supabase não configurado.' }
    }

    setSyncStatus('pulling')
    setSyncDetail('Buscando estado salvo no Supabase...')

    try {
      const { snapshot, latestUpdatedAt, count } = await getRemoteSnapshot()

      if (count === 0) {
        setSyncStatus('idle')
        setSyncDetail('Nenhum registro encontrado no Supabase ainda.')
        return { ok: true, message: 'Sem dados remotos para carregar.' }
      }

      applySnapshot(snapshot)

      const timestamp = latestUpdatedAt || new Date().toISOString()
      writeLastSync(timestamp)
      setLastSyncedAt(timestamp)
      setSyncStatus('idle')
      setSyncDetail('Estado carregado do Supabase com sucesso.')

      return { ok: true, message: 'Estado carregado com sucesso.' }
    } catch (error) {
      setSyncStatus('error')
      setSyncDetail(error?.message || 'Falha ao carregar dados do Supabase.')
      return { ok: false, message: error?.message || 'Falha ao carregar dados.' }
    }
  }, [applySnapshot])

  const syncNow = useCallback(async () => {
    const pushResult = await pushToSupabase()

    if (!pushResult.ok) {
      return pushResult
    }

    const pullResult = await pullFromSupabase()

    if (!pullResult.ok) {
      return pullResult
    }

    setSyncDetail('Supabase sincronizado com sucesso.')
    return { ok: true, message: 'Supabase sincronizado com sucesso.' }
  }, [pullFromSupabase, pushToSupabase])

  return {
    isConfigured: supabaseConfigured,
    syncStatus,
    syncDetail,
    lastSyncedAt,
    pullFromSupabase,
    pushToSupabase,
    syncNow,
  }
}
