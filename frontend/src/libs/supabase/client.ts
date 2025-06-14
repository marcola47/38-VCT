import { createBrowserClient } from '@supabase/ssr'

// Permite passar o accessToken para enviar no header Authorization
export function createClient(accessToken?: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  if (accessToken) {
    // Define o token de autenticação para o cliente
    supabase.auth.setAuth(accessToken)
  }
  return supabase
}

// Utilitário para obter o accessToken do usuário autenticado
export async function getAccessToken() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}