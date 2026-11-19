// src/composables/useCadastroGeral.js
import { ref, computed, onMounted, watch, unref } from "vue"
import { useServices } from "@/modules/acesso/application/useServices"
import { useListasModules } from "@/modules/acesso/application/useListasModules"
import { useListas } from "@/modules/shared/composables/useListas"
import { calcularDestino } from "@/modules/acesso/domain/destinos"

const PREFIXO = /^[A-Z][A-Z0-9]{1,3}-\d{3}$/

export function useCadastroGeral(props, emit) {
  const service = useServices()
  const listasService = useListasModules()
  const {
    fetchListas,
    orgaosOptions,
    docOptions,
    unidadesOptions,
    tratoOptions,
    destinosOptions,
  } = useListas(listasService)

  const buscaDoc = ref(props.documentoInicial || '')
  const nome = ref('')
  const destino_id = ref(null)
  const donoEncontrado = ref(null)
  const loading = ref(false)
  const isVtr = ref(false)

  const valorInicial = props.placaInicial || ''
  const isPrefixo = PREFIXO.test(valorInicial)

  const veiculo = ref({
    placa: isPrefixo ? '' : valorInicial,
    marca: props.marca,
    prefixo: isPrefixo ? valorInicial : '',
    usuario_id: null,
    orgao_id: null,
  })

  const pedestre = ref({
    unidade_id: 260,
    tratamento_id: null,
    tipo_doc_id: null,
    orgao_id: null
  })

  const buscarDono = async (documento = buscaDoc.value) => {
    clearTimeout(buscaTimer)

    const valor = String(documento || '').trim()
    if (valor.length < 4) return

    const idAtual = ++buscaId
    loading.value = true

    try {
      const res = await service.getUsuarioByDoc(valor)

      // Ignora resposta de uma busca anterior, se o documento mudou.
      if (
        idAtual !== buscaId ||
        valor !== String(buscaDoc.value || '').trim()
      ) {
        return
      }

      const usuario = res?.dados

      if (!usuario) {
        limparDadosBusca()
        return
      }

      donoEncontrado.value = usuario
      nome.value = usuario.nomeCompleto || ''

      // destino_id.value = calcularDestino({
      //   data: usuario,
      //   isEntrada: true,
      //   mapaDestinos: destinosOptions
      // })

      veiculo.value.usuario_id = isVtr.value
        ? null
        : usuario.user_id ?? null
    } catch (e) {
      if (idAtual === buscaId) {
        console.error('Erro ao buscar', e)
      }
    } finally {
      if (idAtual === buscaId) {
        loading.value = false
      }
    }
  }

  const contexto = computed(() => props.contexto ?? {
    veiculoCadastrado: false,
    veiculo_id: null,
    usuarioCadastrado: false,
    usuario_id: null,
    isVeiculo: false
  })

  const podeSalvar = computed(() => {
    const temPlaca = !!veiculo.value.placa
    const temOrgao = !!veiculo.value.orgao_id
    const temDono = !!donoEncontrado.value
    const temNome = !!nome.value
    const temDestino = !!destino_id.value
    const temDoc = !!pedestre.value.tipo_doc_id

    if (contexto.value.isVeiculo && contexto.value.veiculoCadastrado) {
      return temDestino && (temDono || (temNome && temDoc))
    }

    if (props.placaInicial) {
      return temPlaca && temDestino && (temOrgao || temDono || temNome)
    }
    return temDestino && temDoc && (temDono || temNome)
  })

  const salvar = async () => {
    loading.value = true

    try {
      let userIdFinal =
        donoEncontrado.value?.user_id ??
        contexto.value.usuario_id ??
        null

      let veiculoIdFinal = contexto.value.veiculoCadastrado
        ? contexto.value.veiculo_id
        : null

      // Cria o usuário antes do veículo quando ainda não existe.
      if (!userIdFinal) {
        const documento = String(buscaDoc.value || '').trim()

        if (documento.length < 4) {
          throw new Error('Informe um documento válido para cadastrar o usuário.')
        }

        const payloadUser = {
          nome: nome.value,
          documento,
          unidade_id: pedestre.value.unidade_id,
          tratamento_id: pedestre.value.tratamento_id,
          tipo_doc_id: pedestre.value.tipo_doc_id,
          orgao_id: pedestre.value.orgao_id,
        }

        const resUser = await service.salvarUsuario(payloadUser)
        const dadosUsuario = resUser?.dados ?? resUser?.data ?? resUser

        userIdFinal =
          dadosUsuario?.user_id ??
          dadosUsuario?.usuario_id ??
          dadosUsuario?.id ??
          null

        if (!userIdFinal) {
          throw new Error('A resposta da API não trouxe o ID do usuário criado.')
        }
      }

      // Cria o veículo somente se for novo.
      if (contexto.value.isVeiculo && !contexto.value.veiculoCadastrado) {
        const payloadVeiculo = {
          placa: veiculo.value.placa || props.placaInicial,
          marca: veiculo.value.marca,
          prefixo: veiculo.value.prefixo,
          orgao_id: veiculo.value.orgao_id,
          usuario_id: isVtr.value ? null : userIdFinal,
        }

        // Todo veículo deve ter pelo menos um dos dois vínculos.
        if (!payloadVeiculo.usuario_id && !payloadVeiculo.orgao_id) {
          throw new Error('O veículo precisa estar vinculado a um usuário ou órgão.')
        }

        const resVeiculo = await service.salvarVeiculo(payloadVeiculo)
        const dadosVeiculo = resVeiculo?.dados ?? resVeiculo?.data ?? resVeiculo

        veiculoIdFinal =
          dadosVeiculo?.veiculo_id ??
          dadosVeiculo?.id ??
          null

        if (!veiculoIdFinal) {
          throw new Error('A resposta da API não trouxe o ID do veículo criado.')
        }
      }

      emit('sucesso', {
        placa: veiculo.value.placa || props.placaInicial,
        usuario_id: userIdFinal,
        destino_id: destino_id.value,
        veiculo_id: veiculoIdFinal,
        orgao_id: userIdFinal
          ? pedestre.value.orgao_id
          : veiculo.value.orgao_id,
        finalizar: true,
        documento: buscaDoc.value,
        prefixo: veiculo.value.prefixo,
      })
    } catch (e) {
      console.error('Erro ao salvar cadastro:', e)
    } finally {
      loading.value = false
    }
  }

  let buscaTimer
  let buscaId = 0


  function limparDadosBusca() {
    donoEncontrado.value = null
    nome.value = ''
    destino_id.value = null
    veiculo.value.usuario_id = null
    pedestre.value.tipo_doc_id = null
    pedestre.value.tratamento_id = null
    pedestre.value.orgao_id = null
  }

  function atualizarDestinoDoUsuario() {
    const usuario = donoEncontrado.value
    const destinos = unref(destinosOptions) || []
    const sigla = usuario?.siglaUbm?.trim().toUpperCase()

    if (!usuario || !destinos.length) {
      destino_id.value = null
      return
    }

    const opcao = destinos.find(
      destino => destino.title?.trim().toUpperCase() === sigla
    )

    destino_id.value = opcao?.title ?? null
  }

  watch(
    [donoEncontrado, () => unref(destinosOptions)],
    atualizarDestinoDoUsuario,
    { immediate: true }
  )

  watch(buscaDoc, (novoDocumento) => {
    clearTimeout(buscaTimer)
    buscaId++
    loading.value = false
    limparDadosBusca()

    const valor = String(novoDocumento || '').trim()
    if (valor.length < 4) return

    const idAtual = buscaId
    buscaTimer = setTimeout(() => {
      if (idAtual === buscaId) {
        buscarDono(valor)
      }
    }, 350)
  })

  watch(
    () => props.placaInicial,
    (valor) => {
      const inicial = String(valor || '').toUpperCase().trim()
      const ehPrefixo = PREFIXO.test(inicial)

      veiculo.value.placa = ehPrefixo ? '' : inicial
      veiculo.value.prefixo = ehPrefixo ? inicial : ''
    },
    { immediate: true }
  )

  onMounted(async () => {
    await fetchListas()
    if (buscaDoc.value) buscarDono()
  })


  return {
    state: {
      veiculo,
      pedestre,
      buscaDoc,
      nome,
      destino_id,
      donoEncontrado,
      loading,
      isVtr
    },
    ui: {
      orgaosOptions,
      unidadesOptions,
      tratoOptions,
      docOptions,
      destinosOptions,
      podeSalvar
    },
    actions: {
      buscarDono,
      salvar
    }
  }
}

