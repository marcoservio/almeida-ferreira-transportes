/**
 * Traduz as mensagens de erro do Supabase Auth para português.
 * Mensagem desconhecida cai em um texto genérico — o original vai para o console.
 */
const traducoes: [RegExp, string][] = [
  [/invalid login credentials/i, "E-mail ou senha incorretos."],
  [/email not confirmed/i, "Confirme seu e-mail antes de entrar."],
  [
    /user already registered|already been registered/i,
    "Este e-mail já possui cadastro.",
  ],
  [
    /password should be at least (\d+)/i,
    "A senha precisa ter no mínimo 6 caracteres.",
  ],
  [/unable to validate email address|invalid email/i, "E-mail inválido."],
  [
    /email rate limit exceeded|too many requests|over_email_send_rate_limit/i,
    "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  ],
  [/new password should be different/i, "A nova senha deve ser diferente da atual."],
  [
    /auth session missing|invalid claim|session_not_found/i,
    "Sua sessão expirou. Faça login novamente.",
  ],
  [
    /fetch failed|network|failed to fetch/i,
    "Sem conexão com o servidor. Verifique sua internet.",
  ],
];

export function traduzirErroAuth(erro: unknown): string {
  const mensagem =
    erro instanceof Error ? erro.message : typeof erro === "string" ? erro : "";

  for (const [padrao, texto] of traducoes) {
    if (padrao.test(mensagem)) return texto;
  }

  if (mensagem) console.error("[auth]", mensagem);
  return "Não foi possível concluir. Tente novamente em instantes.";
}
