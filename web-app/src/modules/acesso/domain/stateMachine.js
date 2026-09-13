import { FLUXO } from "./fluxo"

export const acessoStates = {
  [FLUXO.SAIDA] : {
    async onEnter({ payload, isVeiculo }) {
      console.log('PAYLOAD COMPLETO:', JSON.stringify(payload, null, 2))
      const saida = payload.info.dados
      const usuario = saida.entradaUser || {}
      const veiculo = saida.veiculo || {}
      
      return {
        formPatch: {
          registro_id: saida.id,
          destino_id: saida.destino_id,

          nome: usuario.nome,
          documento: usuario.documento,
          user_id: usuario.id,
          ...(isVeiculo
            ? {
                veiculo_id: veiculo.id,
                marca: veiculo.marca,
                prefixo: veiculo.prefixo,
                placa: veiculo.placa,
              }
            : {})
        }
      }
    }
  },

  [FLUXO.ENTRADA_USUARIO]: {
    async onEnter({ payload, services }) {
      const usuario = payload.extra.dados
      const dadosUsuarios = services.buildUsuarioPayload(usuario)
      
      return { formPatch: dadosUsuarios }
    }
  },

  [FLUXO.ENTRADA_CARRO_USUARIO]: {
    async onEnter({ payload, services }) {
      const veiculo = payload.extra.dados.veiculos
        ?? payload.extra.dados

      let usuarioFinal = null
      
      if (veiculo.documento && services.getUser) {
        usuarioFinal = await services.getUser(veiculo.documento)
      }

      if (!usuarioFinal) {
          usuarioFinal = veiculo
      }

      const dadosUsuario = services.buildUsuarioPayload(usuarioFinal)
      
      return {
        formPatch: {
          veiculo_id: veiculo.id ?? veiculo.veiculo_id ?? null,
          placa: veiculo.placa ?? '',
          marca: veiculo.marca ?? '',
          ...dadosUsuario
        }
      }
    }
  },

  [FLUXO.CARRO_SEM_CONDUTOR]: {
    async onEnter({ payload }) {
      const veiculo = payload.extra.dados.veiculos

      return {
        formPatch: {
          veiculo_id: veiculo.id ?? veiculo.veiculo_id ?? null,
          placa: veiculo.placa ?? '',
          marca: veiculo.marca ?? '',
          prefixo: veiculo.prefixo ?? '',
          destino_id: null
        }
      }
    }
  },

  [FLUXO.NOVO]: {
    async onEnter({ isVeiculo }) {
      return {
        action: 'abrir_novo_cadastro',
        preserveField: isVeiculo ? 'placa' : 'documento'
      }
    }
  }
}