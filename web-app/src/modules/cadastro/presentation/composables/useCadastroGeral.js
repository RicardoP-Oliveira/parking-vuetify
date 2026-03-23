// src/composables/useCadastroGeral.js
import { ref, computed, onMounted, watch } from "vue"
import { useServices } from "@/modules/acesso/application/useServices"
import { useListasModules } from "@/modules/acesso/application/useListasModules"
import { useListas } from "@/modules/shared/composables/useListas"

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

  const valorInicial = props.placaInicial || ''
  const isPrefixo = PREFIXO.test(valorInicial)

  const carro = ref({
    placa: isPrefixo ? '' : valorInicial,
    marca: props.marca || (isPrefixo ? valorInicial : ''),
    user_id: null,
    orgao_id: null
  })

  const pedestre = ref({
    unidade_id: '238',
    gradua_id: null,
    doc_id: null,
    orgao_id: null,
  })

  const buscarDono = async () => {
    const valor = String(buscaDoc.value || '').trim()
    if (valor.length < 4) return
    loading.value = true
    try {
      const res = await service.getUsuarioByDoc(valor)
      if (res?.dados) {
        donoEncontrado.value = res.dados
        carro.value.user_id = res.dados.user_id
        carro.value.orgao_id = null
        nome.value = ''
      } else {
        donoEncontrado.value = null
        carro.value.user_id = null
      }
    } catch (e) {
      console.error("Erro ao buscar", e)
    } finally {
      loading.value = false
    }
  }
  
  const contexto = computed(() => props.contexto ?? {
    carroCadastrado: false,
    carro_id: null,
    usuarioCadastrado: false,
    user_id: null,
    isCarro: false
  })

  const podeSalvar = computed(() => {
    const temPlaca = !!carro.value.placa
    const temOrgao = !!carro.value.orgao_id
    const temDono = !!donoEncontrado.value
    const temNome = !!nome.value
    const temDestino = !!destino_id.value
    const temDoc = !!pedestre.value.doc_id

    if (contexto.value.isCarro && contexto.value.carroCadastrado) {
      return temDestino && (temDono || (temNome && temDoc))
    }

    if (props.placaInicial) {
      return temPlaca && temDestino && (temOrgao || temDono || temNome)
    }
    return temDestino && temDoc &&(temDono || temNome)
  })

  const salvar = async () => {
    loading.value = true
    try {
      let userIdFinal = donoEncontrado.value?.user_id || null
      let carroIdFinal = null
      if (!userIdFinal && buscaDoc.value && buscaDoc.value.length > 3) {
        const payloadUser = {
          n_guerra: nome.value,
          documento: buscaDoc.value,
          ubm_id: pedestre.value.unidade_id,
          gradua_id: pedestre.value.gradua_id,
          doc_id: pedestre.value.doc_id,
          orgao_id: carro.value.orgao_id,
          destino_id: destino_id.value,
        }
        const resUser = await service.salvarUsuario(payloadUser)
        userIdFinal = resUser?.dados?.id || null
      }

      if (contexto.value.isCarro && !contexto.value.carroCadastrado) {
        const payload = {
          placa: carro.value.placa || props.placaInicial,
          marca: carro.value.marca,
          orgao_id: userIdFinal ? null : carro.value.orgao_id,
          user_id: userIdFinal || null,
          destino_id: destino_id.value
        }

        const resCarro = await service.salvarCarro(payload)
        carroIdFinal = resCarro?.dados?.id || null

      }

      emit(
        'sucesso', {
          placa: carro.value.placa,
          user_id: userIdFinal || null,
          destino_id: destino_id.value,
          carro_id: contexto.value.carroCadastrado 
            ? contexto.value.carro_id 
            : carroIdFinal,
          orgao_id: carro.value.orgao_id,
          finalizar: true,
          documento: buscaDoc.value
        }
      )

    } catch (e) {
      console.error("Erro ao salvar", e)
    } finally { loading.value = false }
  }

  onMounted(async () => {
    await fetchListas()

    if (buscaDoc.value) buscarDono()
  })


  return {
    state: {
      carro,
      pedestre,
      buscaDoc,
      nome,
      destino_id,
      donoEncontrado,
      loading
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

