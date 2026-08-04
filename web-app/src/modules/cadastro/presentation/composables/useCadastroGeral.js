// src/composables/useCadastroGeral.js
import { ref, computed, onMounted, watch } from "vue"
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
    unidade_id: '238',
    tratamento_id: null,
    tipo_doc_id: null,
    orgao_id: null
  })

  const buscarDono = async () => {
    const valor = String(buscaDoc.value || '').trim()
    if (valor.length < 4) return
    loading.value = true
    try {
      const res = await service.getUsuarioByDoc(valor)
      if (res?.dados) {
        donoEncontrado.value = res.dados
        if (donoEncontrado) {
          destino_id.value = calcularDestino({
            data: donoEncontrado.value,
            isEntrada: true,
            mapaDestinos: destinosOptions
          })
        }
        if (isVtr.value) {
          veiculo.value.usuario_id = null
        } else {
          veiculo.value.usuario_id = res.dados.user_id
          veiculo.value.orgao_id = null
          nome.value = ''
        }
      } else {
        donoEncontrado.value = null
        veiculo.value.usuario_id = null
      }
    } catch (e) {
      console.error("Erro ao buscar", e)
    } finally {
      loading.value = false
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
      let userIdFinal = donoEncontrado.value?.user_id || null
      let veiculoIdFinal = null
      if (!userIdFinal && buscaDoc.value && buscaDoc.value.length > 3) {
        const payloadUser = {
          nome: nome.value,
          documento: buscaDoc.value,
          unidade_id: pedestre.value.unidade_id,
          tratamento_id: pedestre.value.tratamento_id,
          tipo_doc_id: pedestre.value.tipo_doc_id,
          orgao_id: pedestre.value.orgao_id,
        }
        
        const resUser = await service.salvarUsuario(payloadUser)
        userIdFinal = resUser?.dados?.id || null
      }

      if (contexto.value.isVeiculo && !contexto.value.veiculoCadastrado) {
        const payload = {
          placa: veiculo.value.placa || props.placaInicial,
          marca: veiculo.value.marca,
          prefixo: veiculo.value.prefixo,
          orgao_id: veiculo.value.orgao_id,
          usuario_id: isVtr.value ? null : userIdFinal,
        }
        const resVeiculo = await service.salvarVeiculo(payload)
        veiculoIdFinal = resVeiculo?.dados?.id || null
      }

      emit(
        'sucesso', {
          placa: veiculo.value.placa,
          usuario_id: userIdFinal || null,
          destino_id: destino_id.value,
          veiculo_id: contexto.value.veiculoCadastrado 
            ? contexto.value.veiculo_id 
            : veiculoIdFinal,
          orgao_id: userIdFinal ? pedestre.value.orgao_id : veiculo.value.orgao_id,
          finalizar: true,
          documento: buscaDoc.value,
          prefixo: veiculo.value.prefixo
        }
      )

    } catch (e) {
      console.error("Erro ao salvar", e)
    } finally { loading.value = false }
  }
  watch(buscaDoc, () => {
    destino_id.value = null
    buscarDono()
  })

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

