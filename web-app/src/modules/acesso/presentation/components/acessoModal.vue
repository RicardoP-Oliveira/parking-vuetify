<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :hide-actions="isCadastroNovo"
    :title="isVeiculo ? 'Acesso Veicular' : 'Acesso Pedestre'"
    :confirmText="confirmText"
    :confirmButton="loading || !isFormValid"
    ref="modalRef"
    @confirm="salvar"
    @close="close(props.tipo)"
  >
    <formAcessoCadastro
      v-if="isCadastroNovo"
      :placa-inicial="formData.placa"
      :documento-inicial="formData.documento"
      :marca="formData.marca"
      :modo="modoCadastro"
      :contexto="contexto"
      @sucesso="voltarParaAcesso"
      @cancelar="cancelarCadastro"
    />

    <template v-else-if="isVeiculo">
      <v-row dense>
        <v-col cols="3">
          <v-text-field
            v-model="formData.placa"
            label="Placa"
            @update:model-value="v => formData.placa = (v || '').toUpperCase()"
            @keyup.enter.stop="onPlacaEnter"
            @blur.stop="onPlacaEnter"
            :loading="loading"
            :maxlength="7"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="3">
          <v-text-field
            v-model="formData.prefixo"
            label="Prefixo se Vtr"
            readonly
            variant="filled"
            density="compact"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            :model-value="formData.marca"
            label="Modelo"
            readonly
            variant="filled"
            density="compact"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.documento"
            label="CPF / RG do Condutor"
            @keyup.enter.stop="onDocEnter"
            @blur.stop="onDocEnter"
            :loading="loading"
            variant="underlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.nome"
            label="Nome do Condutor"
            readonly
            variant="underlined"
            density="compact"
            :placeholder="loading ? 'Buscando...' : 'Aguardando documento...'"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="formData.documento"
            label="Documento"
            variant="outlined"
            density="compact"
            @keyup.enter.prevent="onDocEnter"
            @blur="onDocEnter"
            :loading="loading"
            :readonly="isReadOnly"
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

    <v-row dense v-if="!isCadastroNovo && !isSaida">
      <v-col cols="6">
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

    <v-row
      v-if="isVeiculo && formData.placa && !isCadastroNovo"
      class="mt-4"
    >
      <v-col align="center">
        <vue-barcode :value="formData.placa" :height="30" />
      </v-col>
    </v-row>

    <v-row v-if="isErro" dense>
      <v-col cols="12">
        <v-alert type="error" variant="tonal" density="compact">
          Ocorreu um erro ao processar o fluxo.
        </v-alert>
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '@/modules/shared/components/BaseModal.vue'
import formAcessoCadastro from './formAcessoCadastro.vue'
import { useAcessoModal } from '@/modules/acesso/presentation/composables/useAcessoModal'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})

const emit = defineEmits(['closeModal', 'update:options', 'changeTable'])
const modalRef = ref(null)

const { state, ui, actions } = useAcessoModal(props, emit, modalRef)

const {
  formData,
  loading,
  isCadastroNovo,
  isFormValid,
  isSaida,
  contexto,
  isReadOnly,
  machine
} = state

const {
  confirmText,
  destinosOptions,
  modoCadastro,
  isVeiculo
} = ui

const {
  close,
  salvar,
  onPlacaEnter,
  onDocEnter,
  cancelarCadastro,
  voltarParaAcesso
} = actions

const isErro = computed(() => machine?.status === 'erro')
</script>