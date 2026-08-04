import { ref } from "vue"
import { detectarFluxo } from "../domain/fluxo"
import { acessoStates } from "../domain/stateMachine"

export function useAcessoController({ service, isVeiculo }) {
  const loading = ref(false)
  let requestId = 0

  const executarFluxo = async (fluxo, payload, ctx) => {
    const state = acessoStates[fluxo]

    ctx.setFluxo?.(fluxo)

    if (!state?.onEnter) {
      console.warn('Fluxo não tratado:', fluxo)
      return null
    }

    return await state.onEnter({ 
      payload,
      state: ctx.state,
      actions: ctx.actions,
      services: ctx.services,
      isVeiculo
    })
  }

  const buscar = async (termo, ctx, tipo) => {
    if (!termo || termo.length < 4) return null

    const id = ++requestId
    loading.value = true

    try {

      const [info, extra] = await service.buscarServicos(termo, isVeiculo, tipo)

      if (id !== requestId) return null

      const fluxo = detectarFluxo({ info, extra, isVeiculo })
      const result = await executarFluxo(fluxo, { info, extra }, ctx)

      return {
        fluxo,
        result,
        payload: { info, extra }
      }
    } catch (e) {
      console.error('Erro controller:', e)
      return null
    } finally {
      if (id === requestId) {
        loading.value = false
      }
    }
  }

  return {
    loading,
    buscar
  }
}