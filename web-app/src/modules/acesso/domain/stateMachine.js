import { FLUXO } from "./fluxo"

export const acessoStates = {
  [FLUXO.SAIDA] : {
    onEnter: ({ payload, ctx, isCarro }) => {
      const saida = payload.info.dados
      const { formData } = ctx
      formData.registro_id = saida.id
      formData.destino_id = saida.destino_id
      formData.nome = saida.nomeCompleto
      formData.documento = saida.documento
      formData.user_id = saida.e_user_id

      if (isCarro) {        
        formData.carro_id = saida.carro_id
        formData.marca = saida.marca
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
    onEnter: ({ payload, ctx }) => {
      const { formData } = ctx
      const carro = payload.extra.dados

      formData.carro_id = carro.id ?? carro.carro_id ?? null
      formData.placa = carro.placa ?? ''
      formData.marca = carro.marca ?? ''
      ctx.preencherUsuario(carro)
    }
  },

  [FLUXO.CARRO_SEM_CONDUTOR]: {
    onEnter: ({ payload, ctx }) => {
      const { formData } = ctx
      const carro = payload.extra.dados

      formData.carro_id = carro.id ?? carro.carro_id ?? null
      formData.placa = carro.placa ?? ''
      formData.marca = carro.marca ?? ''
      formData.destino_id = null
    }
  },

  [FLUXO.NOVO]: {
    onEnter: ({ ctx , isCarro}) => {
      ctx.limparForm(isCarro ? 'placa' : 'documento')
      ctx.abrirNovoCadastro?.()
    }
  }
}