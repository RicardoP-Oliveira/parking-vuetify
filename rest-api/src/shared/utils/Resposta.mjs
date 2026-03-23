export default class Resposta {
  constructor() {
    this.erro = false;
    this.msg = null;
    this.dados = null;
  }

  sucesso(dados, msg = null) {
    this.erro = false
    this.dados = dados
    this.msg = msg
    return this
  }

  falha(msg, dados = null) {
    this.erro = true
    this.msg = msg
    this.dados = dados
    return this
  }
}
