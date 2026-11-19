import { FLUXO } from "./fluxo"

export const acessoStates = {
  [FLUXO.SAIDA]: {
    async onEnter({ payload, isVeiculo, services }) {
      const saida = payload.info.dados
      const usuario = saida.entradaUser || {}
      const veiculo = saida.veiculo || {}

      const usuarioFinal = await services.getUser(usuario.documento)

      return {
        formPatch: {
          registro_id: saida.id,
          destino: saida.destino,
          nome: usuarioFinal.nomeCompleto,
          user_saida: usuarioFinal.nomeCompleto,
          documento: usuario.documento,
          ...(isVeiculo.value
            ? {
              placa: veiculo.placa,
              prefixo: veiculo.prefixo,
            } : {})
        }
      }
    }
  },

  [FLUXO.ENTRADA_USUARIO]: {
    async onEnter({ payload, services }) {
      const usuario = payload.extra.dados
      const dadosUsuarios = services.buildUsuarioPayload(usuario)
      console.log('onEnter ENTRADA_USUARIO', { usuario, dadosUsuarios })

      return { formPatch: dadosUsuarios }
    }
  },

  [FLUXO.ENTRADA_CARRO_USUARIO]: {
    async onEnter({ payload, services, isVeiculo }) {
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
          ...dadosUsuario,
        }
      }
    }
  },

  [FLUXO.CARRO_SEM_CONDUTOR]: {
    async onEnter({ payload }) {
      const veiculo = payload.extra.dados

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