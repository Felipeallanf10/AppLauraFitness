import { useEffect, useState } from 'react'
import {
  Dumbbell,
  Utensils,
  User,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Apple,
} from 'lucide-react'

const PHRASES = Array.from({ length: 50 }, (_, i) => `Mensagem do Felipe ${i + 1} — Te amo e torço por você!`)

const App = () => {
  const [activeTab, setActiveTab] = useState('dieta')
  const [selectedWorkout, setSelectedWorkout] = useState(() => {
    try {
      const sw = localStorage.getItem('laura_selectedWorkout')
      return sw ? Number(JSON.parse(sw)) : 1
    } catch (err) {
      console.warn('Erro ao ler selectedWorkout', err)
      return 1
    }
  })

  const [completedExercises, setCompletedExercises] = useState(() => {
    try {
      const raw = localStorage.getItem('laura_completed')
      return raw ? JSON.parse(raw) : {}
    } catch (err) {
      console.warn('Erro ao ler completedExercises', err)
      return {}
    }
  })

  const [expandedMeals, setExpandedMeals] = useState(() => {
    try {
      const raw = localStorage.getItem('laura_expandedMeals')
      return raw ? JSON.parse(raw) : {}
    } catch (err) {
      console.warn('Erro ao ler expandedMeals', err)
      return {}
    }
  })

  // Mensagens estáticas (editar apenas no código fonte)
  const phrases = PHRASES

  const dieta = [
    {
      id: 'cafe',
      titulo: 'Café da Manhã',
      principal: {
        itens: [
          '2 fatias de pão integral (coco/light) ou 1 pão francês',
          '2 ovos de galinha',
          '1 colher (sobremesa) de requeijão light',
          '150ml de café',
        ],
        sugestao: 'Pão com queijo + ovos mexidos + requeijão e café.',
      },
      substituicoes: [
        {
          nome: 'Opção Tapioca',
          itens: [
            '1 tapioca (50g)',
            '1 colher (sopa) chia',
            '60g frango desfiado',
            '1 fatia mamão (100g)',
            '150ml café',
          ],
        },
        {
          nome: 'Opção Cuscuz',
          itens: [
            '4 colheres (sopa) cuscuz',
            '1 ovo',
            '20g queijo minas/coalho',
            '1 colher chia',
            '1 colher requeijão light',
            '150ml café',
          ],
        },
      ],
    },
    {
      id: 'almoco',
      titulo: 'Almoço',
      principal: {
        itens: [
          'Frango (180g) ou Patinho (160g) ou Peixe (180g)',
          '7 colheres (sopa) Arroz branco ou Cuscuz',
          '3 colheres (sopa) Feijão',
          'Azeite (2 colheres de sopa)',
          'Salada crua (mínimo 3 tipos) à vontade',
        ],
        sugestao: 'Prato colorido e variado.',
      },
      sobremesa: 'Tangerina, Abacaxi (2 fatias), Laranja ou Melancia (1 fatia).',
      substituicoes: [
        {
          nome: 'Macarronada Fit',
          itens: [
            'Macarrão integral (160g)',
            'Patinho moído (140g)',
            '30g queijo coalho',
            '3 colheres extrato tomate',
            'Legumes no vapor',
          ],
        },
        {
          nome: 'Omelete de Atum',
          itens: [
            '3 ovos',
            '80g Atum ou 100g Frango',
            '130g Arroz branco',
            '1 colher azeite',
            'Legumes no vapor',
          ],
        },
      ],
    },
    {
      id: 'lanche',
      titulo: 'Lanche da Tarde',
      principal: {
        itens: [
          '3 bisnaguinhos integrais (20g cada)',
          '2 fatias médias queijo coalho',
          '1 colher requeijão light',
          '200ml de suco de laranja natural',
        ],
      },
      substituicoes: [
        {
          nome: 'Iogurte Proteico',
          itens: [
            '1 pote iogurte desnatado',
            '6 biscoitos Mãe Terra Tribos',
            '30g Whey Protein',
            '8 castanhas de caju',
          ],
        },
        {
          nome: 'Bolinho de Caneca',
          itens: [
            '2 ovos + 1 banana',
            '2 colheres aveia + 1 colher cacau',
            '30g Whey Protein',
            '2 quadradinhos chocolate 60%',
          ],
        },
        {
          nome: 'Sanduíche Patê',
          itens: [
            '2 fatias pão integral',
            '60g frango ou 40g patinho',
            '15g requeijão light',
            '1 fruta pequena',
          ],
        },
      ],
    },
    {
      id: 'jantar',
      titulo: 'Jantar',
      principal: {
        itens: [
          '100g Atum ou Frango ou 70g Sardinha',
          '2 ovos',
          '2 fatias finas queijo coalho',
          'Salada de legumes cozida',
        ],
        sugestao: 'Omelete de atum/frango.',
      },
      substituicoes: [
        {
          nome: 'Hambúrguer Fit',
          itens: [
            '100g Patinho moído',
            '20g queijo minas light',
            'Cebola + molho tomate',
            '2 fatias pão integral 12 grãos',
          ],
        },
        {
          nome: 'Pizza de Rap10',
          itens: [
            '2 unidades Rap10 integral',
            '80g Frango ou 60g Patinho',
            '2 colheres molho de tomate',
            '20g queijo minas light',
          ],
        },
        {
          nome: 'Macarronada Jantar',
          itens: [
            '150g Patinho ou 160g Frango',
            '160g Macarrão integral',
            '3 colheres extrato tomate',
            'Salada à vontade',
          ],
        },
      ],
    },
  ]

  const treinos = {
    1: {
      nome: 'Treino 1 - Quadríceps',
      exercicios: [
        { nome: 'Cadeira Abdutora', series: '3x10' },
        { nome: 'Mesa Flexora', series: '3x10' },
        { nome: 'Agachamento Hack', series: '3x10' },
        { nome: 'Cadeira Extensora', series: '3x10' },
        { nome: 'Búlgaro', series: '3x10' },
        { nome: 'Extensão de Quadril Maq.', series: '3x10' },
      ],
      cardio: 'Bicicleta - 20 min',
    },
    2: {
      nome: 'Treino 2 - Superiores',
      exercicios: [
        { nome: 'Puxada Alta', series: '3x10' },
        { nome: 'Remada Baixa', series: '3x10' },
        { nome: 'Elevação Lateral', series: '3x10' },
        { nome: 'Desenvolvimento Halter', series: '3x10' },
        { nome: 'Tríceps na Polia', series: '3x10' },
        { nome: 'Rosca Direta', series: '3x10' },
      ],
      cardio: 'Esteira - 20 min',
    },
    3: {
      nome: 'Treino 3 - Glúteo/Posterior',
      exercicios: [
        { nome: 'Cadeira Abdutora', series: '3x10' },
        { nome: 'Elevação Pélvica', series: '3x10' },
        { nome: 'Leg Press', series: '3x10' },
        { nome: 'Stiff Barra', series: '3x10' },
        { nome: 'Step Up', series: '3x10' },
      ],
      cardio: 'Bicicleta - 20 min',
    },
    4: {
      nome: 'Treino 4 - Superiores (Var.)',
      exercicios: [
        { nome: 'Elevação Lateral', series: '3x10' },
        { nome: 'Remada Baixa Aberta', series: '3x10' },
        { nome: 'Remada Articulada', series: '3x10' },
        { nome: 'Elevação Frontal', series: '3x10' },
        { nome: 'Tríceps Corda', series: '3x10' },
        { nome: 'Rosca Direta Barra W', series: '3x10' },
      ],
      cardio: 'Esteira - 20 min',
    },
    5: {
      nome: 'Treino 5 - Inferiores Completo',
      exercicios: [
        { nome: 'Cadeira Abdutora', series: '3x10' },
        { nome: 'Mesa Flexora', series: '3x10' },
        { nome: 'Adutora', series: '3x10' },
        { nome: 'Elevação Pélvica', series: '3x10' },
        { nome: 'Abdução na Polia', series: '3x10' },
        { nome: 'Cadeira Extensora', series: '3x10' },
      ],
      cardio: 'Bicicleta - 20 min',
    },
  }

  const toggleExercise = (id) => {
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleMeal = (id) => {
    setExpandedMeals((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // initial state loaded via lazy initializers to avoid setState in effects

  useEffect(() => {
    try {
      localStorage.setItem('laura_completed', JSON.stringify(completedExercises))
      localStorage.setItem('laura_expandedMeals', JSON.stringify(expandedMeals))
      localStorage.setItem('laura_selectedWorkout', JSON.stringify(selectedWorkout))
      // phrases são editáveis apenas via código; não persistimos aqui
    } catch (e) {
      console.error('Erro ao salvar estado:', e)
    }
  }, [completedExercises, expandedMeals, selectedWorkout, phrases])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-md">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Laura Duarte</h1>
              <p className="text-xs text-slate-500">18 anos • Hipertrofia • 1800kcal</p>
            </div>
          </div>
          <div className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-pink-600">
            Treino 16
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md p-4">
        {/* Mensagem do Dia (frases editáveis apenas via código) */}
        {/* <div className="mb-4 rounded-2xl border border-pink-100 bg-pink-50 p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-pink-600">Mensagem do Dia</p>
          <p className="mt-2 text-sm font-bold text-slate-800">{(() => {
            try {
              const day = new Date().toISOString().slice(0, 10)
              let sum = 0
              for (let i = 0; i < day.length; i++) sum += day.charCodeAt(i)
              return phrases[sum % phrases.length]
            } catch (err) {
              console.warn('Erro ao escolher frase do dia', err)
              return phrases[0]
            }
          })()}</p>
        </div> */}

        <div className="mb-6 flex rounded-2xl border bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('dieta')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition-all duration-200 ${activeTab === 'dieta' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <Utensils size={18} />
            <span className="text-sm font-bold">Dieta</span>
          </button>
          <button
            onClick={() => setActiveTab('treino')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition-all duration-200 ${activeTab === 'treino' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <Dumbbell size={18} />
            <span className="text-sm font-bold">Treino</span>
          </button>
        </div>

        {activeTab === 'dieta' && (
          <div className="animate-in slide-in-from-bottom-2 fade-in space-y-4 duration-500">
            {dieta.map((meal) => (
              <div key={meal.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="flex cursor-pointer select-none items-center justify-between p-5"
                  onClick={() => toggleMeal(meal.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-pink-50 p-2 text-pink-500">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">{meal.titulo}</h3>
                  </div>
                  <div className="text-slate-300">
                    {expandedMeals[meal.id] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                <div className={`px-5 pb-5 transition-all duration-300 ${expandedMeals[meal.id] ? 'block opacity-100' : 'hidden opacity-0'}`}>
                  <div className="mb-4 space-y-3">
                    {meal.principal.itens.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {meal.principal.sugestao && (
                    <div className="flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-[11px] italic text-amber-800">
                      <Info size={14} className="shrink-0" />
                      <span>
                        <strong>Dica:</strong> {meal.principal.sugestao}
                      </span>
                    </div>
                  )}

                  {meal.sobremesa && (
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <Apple size={16} className="text-green-500" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Sobremesa:</span>
                      <p className="text-xs text-slate-700">{meal.sobremesa}</p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Opções de Substituição</p>
                    {meal.substituicoes.map((sub, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-pink-600">{sub.nome}</p>
                        <ul className="space-y-1">
                          {sub.itens.map((item, iidx) => (
                            <li key={iidx} className="flex gap-2 text-xs text-slate-500">
                              <span className="text-slate-300">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-inner">
              <Info className="shrink-0 text-blue-500" size={24} />
              <p className="text-xs font-medium leading-relaxed text-blue-800">
                <strong>Importante:</strong> Variar as proteínas diariamente. Salada à vontade com no mínimo 3 tipos. Beba água constantemente.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'treino' && (
          <div className="animate-in slide-in-from-bottom-2 fade-in space-y-6 duration-500">
            <div className="scrollbar-hide flex justify-center gap-2 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedWorkout(num)}
                  className={`h-14 w-14 shrink-0 rounded-2xl border-2 transition-all duration-300 ${
                    selectedWorkout === num
                      ? 'scale-110 border-slate-900 bg-slate-900 text-white shadow-xl'
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-[10px] font-black opacity-50">T</span>
                  <span className="text-lg font-black">{num}</span>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b bg-slate-900 p-6 text-white">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[3px] text-pink-400">Rotina de Hoje</p>
                  <h2 className="text-xl font-black">{treinos[selectedWorkout].nome}</h2>
                </div>
                <button
                  onClick={() => setCompletedExercises({})}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-transform active:scale-95"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {treinos[selectedWorkout].exercicios.map((ex, idx) => {
                  const exId = `w${selectedWorkout}-e${idx}`
                  const isDone = completedExercises[exId]
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExercise(exId)}
                      className={`flex cursor-pointer items-center justify-between p-5 transition-all ${isDone ? 'bg-green-50/40' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300 ${isDone ? 'border-green-500 bg-green-500 text-white shadow-lg' : 'border-slate-100 bg-white text-slate-300'}`}
                        >
                          {isDone ? <CheckCircle2 size={22} /> : <span className="font-black">{idx + 1}</span>}
                        </div>
                        <div>
                          <p className={`text-base font-bold transition-all ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {ex.nome}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-md bg-pink-50 px-2 py-0.5 text-xs font-black uppercase tracking-tighter text-pink-500/80">
                              {ex.series}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Descanso: 60s</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className={`${isDone ? 'text-green-300' : 'text-slate-300'}`} />
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4 border-t bg-slate-50 p-6">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-500">
                      <Flame size={18} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Meta de Cardio</span>
                  </div>
                  <span className="rounded-xl border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                    {treinos[selectedWorkout].cardio}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-500">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Core (Abdominais)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center text-[10px] font-black uppercase tracking-widest text-blue-700">
                      Supra: 3x15
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center text-[10px] font-black uppercase tracking-widest text-blue-700">
                      Infra: 3x15
                    </div>
                  </div>
                  <div className="mt-4 text-center text-[10px] font-black uppercase tracking-[2px] text-slate-400 opacity-70">
                    Prancha: 40 segundos todos os dias
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <h4 className="text-center text-xs font-black uppercase tracking-[4px] text-slate-400">Protocolo de Segurança</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Priorize a execução correta sobre a carga.',
                  'Respeite o tempo de descanso entre as séries.',
                  'Mantenha-se hidratada durante todo o treino.',
                  'Sono de qualidade é essencial para hipertrofia.',
                ].map((dica, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-600">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                    {dica}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Frases editáveis apenas via código - editor removido da UI */}

      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-100 bg-white p-3 pb-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <button
            onClick={() => setActiveTab('dieta')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dieta' ? 'scale-110 text-pink-600' : 'text-slate-300'}`}
          >
            <Utensils size={26} strokeWidth={activeTab === 'dieta' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Nutrição</span>
          </button>

          <button
            onClick={() => setActiveTab('treino')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'treino' ? 'scale-110 text-pink-600' : 'text-slate-300'}`}
          >
            <Dumbbell size={26} strokeWidth={activeTab === 'treino' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Treino</span>
          </button>

          <button
            className="flex flex-col items-center gap-1 text-slate-300"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <User size={26} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
