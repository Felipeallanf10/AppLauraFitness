# Laura Fitness App

App React + Vite para concentrar dieta, treino e próximos recursos do dia a dia da Laura em uma interface simples e mobile-first.

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura de branches

- `main`: somente código estável e testado.
- `develop`: branch de integração.
- `feature/<nome>`: tarefas pequenas e isoladas.

Fluxo recomendado:
1. criar a branch a partir de `develop`
2. implementar e testar localmente
3. abrir merge request / pull request para `develop`
4. depois de validado, promover `develop` para `main`

## Supabase

Para habilitar a sincronização:

1. criar um projeto no Supabase
2. definir as variáveis de ambiente:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
VITE_SUPABASE_PROFILE_ID=laura-profile
```

3. criar a tabela `settings` com, no mínimo:

- `profile_id` (text)
- `key` (text)
- `value` (jsonb)
- `updated_at` (timestamptz)

4. ativar RLS e permitir acesso apenas ao `profile_id` escolhido.

No app, a sincronização fica disponível no painel de configurações com as ações:
- enviar estado para o Supabase
- baixar estado do Supabase
- sincronizar agora

## Notas

- A playlist do Spotify é definida no código fonte.
- As frases de incentivo também são definidas no código fonte, sem edição pela UI da Laura.
- O fluxo de versionamento segue o padrão combinado: nada direto em `main`.
