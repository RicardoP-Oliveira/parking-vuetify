import { ref } from "vue"
import { detectarFluxo, FLUXO } from "../domain/fluxo"

export function useAcessoController({ service, isCarro }) {
  const loading = ref(false)
  let requestId = 0

  const executarFluxo = async (fluxo, payload, ctx) => {
    const { formData, limparForm, preencherUsuario, setFluxo } = ctx
    setFluxo(fluxo)

    switch (fluxo) {
      case FLUXO.SAIDA:
        const saida = payload.info.dados

        Object.assign(formData, {
          registro_id: saida.id,
          destino_id: saida.destino_id,
          nome: saida.nomeCompleto,
          documento: saida.documento
        })

        if (isCarro) {
          Object.assign(formData, {
            carro_id: saida.carro_id,
            modelo: saida.modelo,
            placa: saida.placa
          })
        }
        break

      case FLUXO.ENTRADA_USUARIO:
        preencherUsuario(payload.extra.dados)
        break

      case FLUXO.ENTRADA_CARRO_USUARIO:
        Object.assign(formData, payload.extra.dados)
        preencherUsuario(payload.extra.dados)
        break

      case FLUXO.CARRO_SEM_CONDUTOR:
        Object.assign(formData, payload.extra.dados)
        formData.destino_id = null
        break

      case FLUXO.NOVO:
        limparForm()
        break
    }
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