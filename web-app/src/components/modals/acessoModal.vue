<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :hide-actions="isNovoCadastro"
    :title="tipoForm === 'carro' ? 'Acesso Veicular' : 'Acesso Pedestre'"
    :confirmText="isAction"
    ref="modalRef"
    @confirm="salvar"
    @close="close(props.tipo)"
    :confirmButton ="loading || !isFormValid"
  >
    <formAcessoCadastro
      v-if="isNovoCadastro"
      :placa-inicial="formData.placa" 
      :documento-inicial="formData.documento"
      @sucesso="voltarParaAcesso"
      @cancelar="voltarParaAcesso(null)"
    />
    
    <template v-if="tipoForm === 'carro' && !isNovoCadastro">
      <v-row dense>
        <v-col cols="6">
          <v-text-field v-model="formData.placa" label="Placa" readonly :maxlength="7" variant="underlined" :disabled="!formData.modelo" />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="formData.modelo" label="Modelo/Prefixo" readonly :maxlength="7" variant="underlined" :disabled="!formData.modelo" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="formData.documento" label="Documento(RG/CPF)" variant="underlined" autofocus />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="formData.nome" label="Condutor" variant="underlined" readonly />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="tipoForm === 'pedestre' && !isNovoCadastro">
      <v-row dense>
        <v-col cols="4">
          <v-text-field v-model="formData.documento" label="Documento(RG/CPF)" variant="underlined" :readOnly="isReadOnly" :error="showError" autofocus />
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="formData.nome" label="Nome" readonly variant="underlined" @update:model-value="nome = nome?.toUpperCase()" />
        </v-col>
      </v-row>
    </template>
    <v-row dense>
      <v-col cols="8" v-if="!isNovoCadastro">
        <v-select v-model="formData.destino_id" :items="destinosOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Destino" variant="underlined" />
      </v-col>
    </v-row>
    <v-row v-if="tipoForm === 'carro' && formData.placa && !isNovoCadastro" class="mt-4">
      <v-col align="center"><vue-barcode :value="formData.placa" :height="40" /></v-col>
    </v-row>
    
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/modals/BaseModal.vue'
import formAcessoCadastro from './formAcessoCadastro.vue'
import { useAcessoForm } from '@/composables/useAcessoForm'
import { nextTick, watch, ref} from 'vue'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})

const modalRef = ref(null)

const voltarParaAcesso = async (dadosCadastro) => {  
  if (!dadosCadastro || dadosCadastro.fecharTudo) {
    isNovoCadastro.value = false
    emit('closeModal')
    return
  }

  if (!dadosCadastro.user_id && dadosCadastro.carro_id) {
    formData.placa = dadosCadastro.placa
    isNovoCadastro.value = false
    await buscarDados()
    return
  } else if (dadosCadastro.finalizar && dadosCadastro.user_id) {
    if (dadosCadastro.user_id) formData.user_id = dadosCadastro.user_id
    if (dadosCadastro.carro_id) formData.carro_id = dadosCadastro.carro_id
    if (dadosCadastro.destino_id) formData.destino_id = dadosCadastro.destino_id
  }
  await salvar()
}

const emit = defineEmits(['closeModal', 'update:options', 'changeTable'])

const {
  formData,
  isAction, showError, loading,
  destinosOptions, salvar, close, isReadOnly,
  isFormValid, buscarDados,
  isNovoCadastro
} = useAcessoForm(props, emit)

watch(() => isFormValid.value, async(valido) => {
  if (valido) {
    await nextTick()
    setTimeout(() => {
      const btnEl = modalRef.value?.getConfirmButtonEl()
      if (btnEl) {
        btnEl.focus()
      } else {
        const fallbackBtn = document.querySelector('.v-card-action .v-btn--variant-flat')
        fallbackBtn?.focus()
      }
    }, 50)    
  }
})
</script>
