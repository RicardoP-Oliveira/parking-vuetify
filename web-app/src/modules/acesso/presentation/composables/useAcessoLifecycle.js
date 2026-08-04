import { onMounted, watch, nextTick } from 'vue'

export function useAcessoLifecycle({
  fetchListas,
  props,
  isVeiculo,
  formData,
  send,
  buscarDados,
  isFormValid,
  modalRef
}) {
  onMounted(async () => {
    await fetchListas()

    if (props.dialog?.novoCadastro) {
      if (isVeiculo.value) {
        formData.placa = props.dialog?.idPlaca || ''
        send('ABRIR_CADASTRO_NOVO', { modoCadastro: 'completo' })
      } else {
        formData.documento = props.dialog?.documento || ''
        send('ABRIR_CADASTRO_NOVO', { modoCadastro: 'pedestre' })
      }
      return
    }

    const inicial = props.dialog?.idPlaca || props.dialog?.documento

    if (inicial) {
      if (isVeiculo.value) {
        formData.placa = inicial
      } else {
        formData.documento = inicial
      }

      await buscarDados()
    }

    if (isFormValid.value) {
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  })

  watch(
    () => formData.destino_id,
    async (val) => {
      if (!val) return
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  )
}