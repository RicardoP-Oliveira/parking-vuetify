<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :hide-actions="isNovoCadastro"
    :title="tipoForm === 'carro' ? 'Acesso Veicular' : 'Acesso Pedestre'"
    :confirmText="confirmText"
    ref="modalRef"
    @confirm="salvar"
    @close="close(props.tipo)"
    :confirmButton ="loading || buscando || !isFormValid"
  >
    <formAcessoCadastro
      v-if="isNovoCadastro"
      :placa-inicial="formData.placa" 
      :documento-inicial="formData.documento"
      :modelo="formData.modelo"
      :modo="modoCadastro"
      @sucesso="voltarParaAcesso"
      @cancelar="isNovoCadastro = false"
    />
    
    <template v-if="tipoForm === 'carro' && !isNovoCadastro">
      <v-row dense>
        <v-col cols="6">
          <v-text-field
            v-model="formData.placa"
            label="Placa"
            @keyup.enter.stop="onPlacaEnter"
            @blur.stop="onPlacaEnter"
            :loading="loading || buscando"
            :maxlength="7"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="formData.marca"
            label="Modelo/Prefixo"
            readonly
            variant="filled"
            density="compact"
            placeholder="Opcional"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.documento"
            label="CPF / RG do Condutor"
            @keyup.enter.stop="onDocEnter"
            @blur.stop="onDocEnter"
            :loading="loading || buscando"
            variant="underlined"
            density="compact"
            />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.nome"
            label="Nome do Condutor"
            variant="underlined"
            density="compact"
            readonly
            :placeholder="buscando ? 'Buscando...' : 'Aguardando documento...'"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="tipoForm === 'pedestre' && !isNovoCadastro">
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="formData.documento"
            label="Documento"
            variant="outlined"
            density="compact"
            @keyup.enter.prevent="onDocEnter"
            @blur="onDocEnter"
            :loading="loading || buscando"
            :readOnly="isReadOnly"
          />
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="formData.nome"
            label="Nome"
            readonly
            variant="underlined"
            density="compact"
          />
        </v-col>
      </v-row>
    </template>
    <v-row dense>
      <v-col cols="8" v-if="!isNovoCadastro && confirmText !== 'SAÍDA'">
        <v-select
          v-model="formData.destino_id"
          :items="destinosOptions"
          :readonly="isReadOnly"
          item-title="title"
          item-value="id"
          label="Destino"
          variant="underlined"
          density="compact"
          color="primary"
        />
      </v-col>
    </v-row>
    <v-row v-if="tipoForm === 'carro' && formData.placa && !isNovoCadastro" class="mt-4">
      <v-col align="center"><vue-barcode :value="formData.placa" :height="30" /></v-col>
    </v-row>
    
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/modules/shared/components/BaseModal.vue'
import formAcessoCadastro from './formAcessoCadastro.vue'
import { useAcessoForm } from '@/modules/acesso/presentation/composables/useAcessoForm'
import { nextTick, ref} from 'vue'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})
const emit = defineEmits(['closeModal', 'update:options', 'changeTable'])
const modalRef = ref(null)
const modoCadastro = ref(null)

const {
  formData, loading, buscando, confirmText,
  destinosOptions, isReadOnly, salvar, close, 
  isFormValid, isNovoCadastro, onPlacaEnter, onDocEnter, buscarDados
} = useAcessoForm(props, emit, modalRef)

const voltarParaAcesso = async (dadosCadastro) => {
  if (!dadosCadastro || dadosCadastro.fecharTudo) {
    isNovoCadastro.value = false
    formData.placa = ''
    emit('closeModal')
    return
  }

  if (!dadosCadastro.user_id && dadosCadastro.carro_id) {
    formData.placa = dadosCadastro.placa
    formData.modelo = dadosCadastro.modelo

    modoCadastro.value = dadosCadastro.orgao_id
      ? 'condutor'
      : 'completo'

    isNovoCadastro.value = true
    return
  }

  if (dadosCadastro.finalizar && dadosCadastro.user_id) {
    formData.user_id = dadosCadastro.user_id
    formData.carro_id = dadosCadastro.carro_id
    formData.destino_id = dadosCadastro.destino_id

    isNovoCadastro.value = false
    await nextTick()
    await salvar()
  }
}
</script>
