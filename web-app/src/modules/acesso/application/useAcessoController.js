import { ref } from "vue"
import { detectarFluxo } from "../domain/fluxo"
import { acessoStates } from "../domain/stateMachine"

export function useAcessoController({ service, isCarro }) {
  const loading = ref(false)
  let requestId = 0

  const executarFluxo = async (fluxo, payload, ctx) => {
    ctx.setFluxo?.(fluxo)
    const state = acessoStates[fluxo]

    if (!state) {
      console.warn('Fluxo não tratado:', fluxo)
      return
    }

    await state.onEnter({ payload, ctx, isCarro})
  }

  const buscar = async (termo, ctx, tipo) => {
    if (!termo || termo.length < 4) return

    const id = ++requestId
    loading.value = true

    try {
      const [info, extra] = await service.buscarServicos(termo, isCarro, tipo)

      if (id !== requestId) return

      const fluxo = detectarFluxo({ info, extra, isCarro })
      await executarFluxo(fluxo, { info, extra }, ctx)
    } catch (e) {
      console.error('Erro controller:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    buscar
  }
}