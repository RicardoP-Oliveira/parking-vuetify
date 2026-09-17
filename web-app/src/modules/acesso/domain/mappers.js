const nomeResolvido = (val) =>
[val?.graduaAbrev, val?.orgaoSigla, val?.condutor]
  .filter(Boolean).join(' ')

export const mapUser = (u, campoUsuario = 'user_entrada_id') => ({
    [campoUsuario]: u.user_id,
    nome: u.nomeCompleto || nomeResolvido(u),
    ubm_id: u.ubm_id,
    orgao_id: u.orgao_id,
    gradua_id: u.gradua_id,
    documento: u.doc || u.documento
  })