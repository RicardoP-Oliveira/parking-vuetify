// src/modules/acesso/presentation/composables/useAcessoMachine.js
import { reactive, computed } from 'vue'

export const STATUS = {
  IDLE: 'idle',
  CARREGANDO: 'carregando',
  ACESSO: 'acesso',
  CADASTRO_NOVO: 'cadastro_novo',
  SALVANDO: 'salvando',
  ERRO: 'erro'
}

const transitions = {
  [STATUS.IDLE]: {
    BUSCAR: STATUS.CARREGANDO,
    ABRIR_CADASTRO_NOVO: STATUS.CADASTRO_NOVO
  },
  [STATUS.CARREGANDO]: {
    BUSCA_SUCESSO: STATUS.ACESSO,
    ABRIR_CADASTRO_NOVO: STATUS.CADASTRO_NOVO,
    FALHA: STATUS.ERRO
  },
  [STATUS.ACESSO]: {
    BUSCAR: STATUS.CARREGANDO,
    ABRIR_CADASTRO_NOVO: STATUS.CADASTRO_NOVO,
    SALVAR: STATUS.SALVANDO
  },
  [STATUS.CADASTRO_NOVO]: {
    CANCELAR_CADASTRO: STATUS.ACESSO,
    VOLTAR_ACESSO: STATUS.ACESSO,
    SALVAR: STATUS.SALVANDO
  },
  [STATUS.SALVANDO]: {
    SALVO: STATUS.IDLE,
    FALHA: STATUS.ERRO
  },
  [STATUS.ERRO]: {
    BUSCAR: STATUS.CARREGANDO,
    ABRIR_CADASTRO_NOVO: STATUS.CADASTRO_NOVO,
    CANCELAR_CADASTRO: STATUS.IDLE
  }
}

export function useAcessoMachine() {
  const machine = reactive({
    status: STATUS.IDLE,
    fluxo: null,
    modoCadastro: null,
    error: null,
    lastTermo: null
  })

  const send = (evento, payload = {}) => {

    const current = machine.status
    const next = transitions[current]?.[evento]

    if (!next) {
      console.warn(`Transição inválida: ${current} -> ${evento}`)
      return false
    }

    machine.status = next

    if ('fluxo' in payload) machine.fluxo = payload.fluxo
    if ('modoCadastro' in payload) machine.modoCadastro = payload.modoCadastro
    if ('error' in payload) machine.error = payload.error
    if ('lastTermo' in payload) machine.lastTermo = payload.lastTermo

    return true
  }

  const isIdle = computed(() => machine.status === STATUS.IDLE)
  const isCarregando = computed(() => machine.status === STATUS.CARREGANDO)
  const isAcesso = computed(() => machine.status === STATUS.ACESSO)
  const isCadastroNovo = computed(() => machine.status === STATUS.CADASTRO_NOVO)
  const isSalvando = computed(() => machine.status === STATUS.SALVANDO)
  const isErro = computed(() => machine.status === STATUS.ERRO)
  const isBusy = computed(() => isCarregando.value || isSalvando.value)

  return {
    machine,
    send,
    isIdle,
    isCarregando,
    isAcesso,
    isCadastroNovo,
    isSalvando,
    isErro,
    isBusy
  }
}