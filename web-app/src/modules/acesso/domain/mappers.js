const nomeResolvido = (val) =>
  [val?.graduaAbrev, val?.orgaoSigla, val?.condutor]
    .filter(Boolean).join(' ')

export const mapUser = (u, campoUsuario = 'documento_entrada') => ({
  // [campoUsuario]: u.doc,
  nome: u.nomeCompleto || nomeResolvido(u),
  destino: u.siglaUbm
})