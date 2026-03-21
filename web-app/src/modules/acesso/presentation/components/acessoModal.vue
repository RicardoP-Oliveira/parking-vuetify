<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :hide-actions="isNovoCadastro"
    :title="isCarro ? 'Acesso Veicular' : 'Acesso Pedestre'"
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
      :marca="formData.marca"
      :modo="modoCadastro"
      :contexto="contexto"
      @sucesso="voltarParaAcesso"
      @cancelar="cancelarCadastro"
    />
    
    <template v-if="isCarro && !isNovoCadastro">
      <v-row dense>
        <v-col cols="6">
          <v-text-field
            v-model="formData.placa"
            label="Placa"
            @update:model-value="v => formData.placa = (v || '').toUpperCase()"
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

    <template v-else-if="!isNovoCadastro">
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
      <v-col cols="8" v-if="!isNovoCadastro && !isSaida">
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
    <v-row v-if="isCarro && formData.placa && !isNovoCadastro" class="mt-4">
      <v-col align="center"><vue-barcode :value="formData.placa" :height="30" /></v-col>
    </v-row>
    
  </BaseModal>
</template>

<script setup>
import { ref} from 'vue'
import BaseModal from '@/modules/shared/components/BaseModal.vue'
import formAcessoCadastro from './formAcessoCadastro.vue'
import { useAcessoForm } from '@/modules/acesso/presentation/composables/useAcessoForm'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})
const emit = defineEmits(['closeModal', 'update:options', 'changeTable'])
const modalRef = ref(null)

const { state, ui, actions } = useAcessoForm(props, emit, modalRef)

const {
  formData,
  loading,
  buscando,
  isNovoCadastro,
  isFormValid,
  isSaida,
  contexto,
  isReadOnly
} = state

const {
  confirmText,
  destinosOptions,
  modoCadastro,
  isCarro
} = ui

const {
  close,
  salvar,
  onPlacaEnter,
  onDocEnter,
  cancelarCadastro,
  voltarParaAcesso,
} = actions
</script>
