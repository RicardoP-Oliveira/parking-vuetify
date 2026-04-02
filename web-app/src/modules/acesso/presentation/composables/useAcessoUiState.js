import { computed } from 'vue'
import { FLUXO } from '@/modules/acesso/domain/fluxo'

const patternPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

export function useAcessoUiState({ machine, formData, isVeiculo, isBusy }) {
  const confirmText = computed(() =>
    machine.fluxo === FLUXO.SAIDA ? 'SAÍDA' : 'ENTRADA'
  )

  const isSaida = computed(() => machine.fluxo === FLUXO.SAIDA)
  const isReadOnly = computed(() => isSaida.value)
  const loading = computed(() => isBusy.value)

  const isFormValid = computed(() => {
    if (loading.value) return false

    const baseOk =
      !!formData.nome &&
      !!formData.destino_id &&
      formData.documento?.length > 3

    if (isVeiculo.value) {
      return patternPlaca.test(formData.placa) && baseOk
    }

    return baseOk
  })

  return {
    confirmText,
    isSaida,
    isReadOnly,
    loading,
    isFormValid
  }
}