// src/composables/useCadastroGeral.js
import { ref, computed, onMounted, watch } from "vue"
import { useServices } from "./useService"
import { useListas } from "./useListas"

export function useCadastroGeral(props, emit) {
  const service = useServices()
  const {
    fetchListas,
    orgaosOptions,
    docOptions,
    unidadesOptions,
    tratoOptions,
    destinosOptions,
  } = useListas(service)

  let debounceTimer = null
  
  const buscaDoc = ref(props.documentoInicial || '')
  const nome = ref('')
  const destino_id = ref(null)
  const donoEncontrado = ref(null)
  const loading = ref(false)

  const carro = ref({
    placa: props.placaInicial,
    marca: '',
    user_id: null,
    orgao_id: null
  })

  const pedestre = ref({
    unidade_id: 241,
    gradua_id: null,
    doc_id: null,
    orgao_id: null,
  })

  const tipoVinculo = ref('pedestre')

  watch(tipoVinculo, (val) => {
  if (val === 'orgao') {
    buscaDoc.value = ''
    nome.value = ''
    donoEncontrado.value = null
  } else {
    carro.value.orgao_id = null
  }
})

  const buscarDono = async () => {
    if (buscaDoc.value.length < 4) return
    loading.value = true
    try {
      const res = await service.getUsuarioByDoc(buscaDoc.value)
      if (res?.dados) {
        donoEncontrado.value = res.dados
        carro.value.user_id = res.dados.user_id
        carro.value.orgao_id = null
        nome.value = ''
      } else {
        console.log("Nenhum dono encontrado para o documento:", buscaDoc.value)
        donoEncontrado.value = null
        carro.value.user_id = null
      }
    } catch (e) {
      console.error("Erro ao buscar", e)
    } finally {
      loading.value = false
    }
  }
  
  const podeSalvar = computed(() => {
    const temPlaca = !!carro.value.placa
    const temOrgao = !!carro.value.orgao_id
    const temDono = !!donoEncontrado.value
    const temNome = !!nome.value
    const temDestino = !!destino_id.value
    const temDoc = !!pedestre.value.doc_id

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
        const resUser = await service.storeUsuario(payloadUser)
        userIdFinal = resUser?.dados?.id || null
      }

      if (props.placaInicial) {
        const payload = {
          placa: props.placaInicial,
          marca: carro.value.marca,
          orgao_id: userIdFinal ? null : carro.value.orgao_id,
          user_id: userIdFinal || null,
          destino_id: destino_id.value
        }
        const resCarro = await service.storeCarro(payload)
        carroIdFinal = resCarro?.dados?.id || null
      }

      emit(
        'sucesso', {
          placa: carro.value.placa,
          user_id: userIdFinal,
          destino_id: destino_id.value,
          carro_id: props.placaInicial ? carroIdFinal : null,
          ogaro_id: carro.value.orgao_id,
          finalizar: true
        }
      )

    } catch (e) {
      console.error("Erro ao salvar", e)
    } finally { loading.value = false }
  }

  watch(nome, (val) => {
    if (val) return nome.value = nome.value.toUpperCase()
})

  watch(buscaDoc, (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!newVal || newVal.length < 4) {
      donoEncontrado.value = null
      carro.value.user_id = null
      return
    }
    debounceTimer = setTimeout(() => buscarDono(newVal), 500)
  })

  onMounted(async () => {
    await fetchListas()
    if (buscaDoc.value) buscarDono()
  })

  return {
    carro, buscaDoc, nome, destino_id, donoEncontrado, orgaosOptions, unidadesOptions, pedestre,
    loading, tratoOptions, docOptions, destinosOptions, buscarDono, podeSalvar, tipoVinculo, salvar
  }
}

