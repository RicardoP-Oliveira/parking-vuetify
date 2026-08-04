import { FLUXO } from '../../domain/fluxo'

export function useAcessoSalvar({
  service,
  formData,
  machine,
  props,
  emit,
  send
}) {
  const salvar = async () => {
    send('SALVAR')

    try {
      const payload = { ...formData, tab: props.tipo }

      if (machine.fluxo === FLUXO.SAIDA) {
        await service.saida(payload)
      } else {
        await service.entrada({
          dados: payload,
          tab: props.tipo
        })
      }

      send('SALVO')
      emit('closeModal', props.tipo)
    } catch (e) {
      console.error('Erro ao salvar:', e)
      send('FALHA', { error: e })
    }
  }

  return {
    salvar
  }
}