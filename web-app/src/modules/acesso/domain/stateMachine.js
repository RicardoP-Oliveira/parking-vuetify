import { FLUXO } from "./fluxo"

export const acessoStates = {
  [FLUXO.SAIDA] : {
    onEnter: ({ payload, ctx, isVeiculo }) => {
      const saida = payload.info.dados
      const veiculo = saida.veiculo
      const { formData } = ctx

      formData.registro_id = saida.id
      formData.destino_id = saida.destino_id
      formData.nome = saida.nomeCompleto
      formData.documento = saida.documento
      formData.user_id = saida.user_entrada_id

      if (isVeiculo) {        
        formData.veiculo_id = saida.veiculo_id
        formData.marca = veiculo.marca
        formData.prefixo = veiculo.prefixo
        formData.placa = saida.placa
      }
    }
  },

  [FLUXO.ENTRADA_USUARIO]: {
    onEnter: ({ payload, ctx }) => {
      ctx.preencherUsuario(payload.extra.dados)
    }
  },

  [FLUXO.ENTRADA_CARRO_USUARIO]: {
    onEnter: async ({ payload, ctx }) => {
      const { formData } = ctx
      const veiculo = payload.extra.dados

      formData.veiculo_id = veiculo.id ?? veiculo.veiculo_id ?? null
      formData.placa = veiculo.placa ?? ''
      formData.marca = veiculo.marca ?? ''
      
      if (veiculo.documento && ctx.getUser) {
        const user = await ctx.getUser(veiculo.documento)
        if (user) {
          ctx.preencherUsuario(user)
          return
        }
      }
      ctx.preencherUsuario(veiculo)
    }
  },

  [FLUXO.CARRO_SEM_CONDUTOR]: {
    onEnter: ({ payload, ctx }) => {
      const { formData } = ctx
      const veiculo = payload.extra.dados

      formData.veiculo_id = veiculo.id ?? veiculo.veiculo_id ?? null
      formData.placa = veiculo.placa ?? ''
      formData.marca = veiculo.marca ?? ''
      formData.prefixo = veiculo.prefixo ?? ''
      formData.destino_id = null
    }
  },

  [FLUXO.NOVO]: {
    onEnter: ({ ctx , isVeiculo}) => {
      ctx.limparForm(isVeiculo ? 'placa' : 'documento')
      ctx.abrirNovoCadastro?.()
    }
  }
}