## Roadmap e Plano de Ações (Prioridade: Integração Supabase Agora)

Objetivo: transformar o MVP atual (Vite + React + Tailwind) em um app confiável para uso diário pela Laura, com backup/sincronização automática no Supabase como prioridade imediata.

Escopo excluído (não serão implementados agora):
- Onboarding e perfil automático (ajustes iniciais de calorias/horários).  
- Integração com Google Fit / Apple Health.  
- Recomendações ML e roles remotas de coach.

Já disponível no MVP / manutenção futura:
- Mensagem do Dia: widget diário com frases definidas por código, sem edição pela UI da Laura.  
- Spotify: playlist definida por você no código; a Laura não cola link. Embed opcional pode ser adicionado depois.

Visão Geral das mudanças que vamos implementar (ordenadas por prioridade):

1) Integração Supabase (Imediata - Prioridade Máxima)
  - Objetivo: backup automático, sincronização e acesso multi-dispositivo eventual.
  - Tarefas técnicas:
    1. Criar projeto Supabase e tabelas (schema mínimo abaixo).
    2. Adicionar pacote `@supabase/supabase-js` e abstração `src/lib/supabase.js` com inicialização usando `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
    3. Implementar hooks React: `useSyncProfile`, `useSyncWorkouts`, `useSyncMeals` (ler localStorage -> sync -> persistir no Supabase; e sync reverso em load).
    4. Políticas RLS: permitir acesso apenas para um `profile_id` fixo (UUID) — aceitável para app pessoal; documentar risco.
    5. Estratégia de conflito: usar `updated_at` e `last-writer-wins` por campo/tabela; fornecer opção de forçar sync manual.
  - Entregáveis:
    - `src/lib/supabase.js`
    - `src/hooks/useSupabaseSync.js` (funções: `syncToRemote()`, `syncFromRemote()`)
    - Documentação em `SUPABASE_AND_ROADMAP.md` com comandos e variáveis de ambiente.

2) Registro Diário e Timers (Alta Prioridade)
  - Implementar funcionalidade para marcar refeições como "consumidas" por data.
  - Registrar entradas de treino (workout_entries) com `completed_exercises` e timestamp.
  - Cronômetro / timer de descanso entre séries (opção de som/vibração) e contador de séries.

3) Histórico e Visualização (Média Prioridade)
  - Salvar histórico por data e oferecer gráficos simples (Chart.js).
  - Tela "Hoje" com checklist rápido (refeições + treino + água).

4) PWA e Deploy (Média Prioridade)
  - Transformar app em PWA para uso no celular (offline + instalação).  
  - Configurar CI/CD e Deploy (Vercel recomendado). Variáveis de ambiente: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

5) Grocery / Planejamento de Refeições (Média Prioridade)
  - Gerar lista de compras a partir do plano semanal de refeições.
  - Permitir marcar itens já comprados e exportar a lista.

6) Notificações (Baixa Prioridade inicialmente)
  - In-app reminders e Notification API (quando o app estiver aberto) — permitir depois Push Service se quiser notificações mesmo com app fechado.

Schema mínimo sugerido (Supabase)
- `profiles` (id uuid PK, name text, kcal_goal int, prefs jsonb, updated_at timestamptz)
- `workout_entries` (id uuid PK, profile_id fk, date date, workout_id int, completed_exercises jsonb, notes text, updated_at timestamptz)
- `meal_entries` (id uuid PK, profile_id fk, date date, meal_id text, items jsonb, eaten boolean, updated_at timestamptz)
- `phrases` (id uuid PK, profile_id fk, text text, ord int)
- `phrases` (id uuid PK, profile_id fk, text text, ord int) — *nota: as frases serão gerenciadas apenas por você (edição via código ou via Supabase se preferir), a UI da Laura não permitirá edição.*
- `settings` (id uuid PK, profile_id fk, key text, value jsonb)

Grocery / lista de compras sugerida (opcional no banco)
- `shopping_lists` (id uuid PK, profile_id fk, week_start date, items jsonb, created_at timestamptz, updated_at timestamptz)

Políticas RLS recomendadas (resumo)
- Ativar RLS para cada tabela.  
- Policy exemplo: permitir `INSERT`, `UPDATE`, `DELETE`, `SELECT` apenas se `profile_id = 'UUID_FIXO_LAURA'`.

Estratégia de implementação e critérios de aceitação
- Passo 1 (config e hook): criar `src/lib/supabase.js` e `src/hooks/useSupabaseSync.js` com funções de leitura/gravação; deploy da app com env vars de teste.  
- Critério: Backup automático criará linhas em `workout_entries` e `meal_entries` ao clicar em "Sincronizar" e as entradas aparecem no painel do Supabase.

Segurança e advertências
- Não incluir `service_role` no cliente.  
- Para maior segurança no futuro: criar função serverless que faça operações sensíveis com `service_role` e expor endpoint protegido.

Checklist técnico (tarefas de implementação)
- [ ] Criar projeto Supabase e tabelas.  
- [ ] Adicionar `@supabase/supabase-js` ao projeto.  
- [ ] Implementar `src/lib/supabase.js`.  
- [ ] Implementar hooks de sync.  
- [ ] Integrar chamadas de sync no fluxo do app (botão manual + sync automático on-start).  
- [ ] Testar conflitos e documentar comportamento de resolução.  
- [ ] Planejamento de refeições e lista de compras semanal.  
- [ ] Atualizar README com instruções para criar projeto Supabase e setar env vars.

Tempo estimado (para integração Supabase completa): 1 dia para implementar hooks + testes básicos; +0.5 dia para políticas RLS e documentação.

Comandos úteis
```bash
# instalar dependência Supabase
npm install @supabase/supabase-js

# rodar dev
npm run dev
```

Próximo passo que eu executo assim que confirmar: 
1) criar `src/lib/supabase.js`, 
2) adicionar dependência, 
3) implementar hooks de sync e 
4) integrar um botão "Sincronizar agora" no painel de configurações.

---
Arquivo gerado automaticamente pelo assistente; se quiser que eu comece agora, confirme e eu implemento a integração Supabase imediatamente.
