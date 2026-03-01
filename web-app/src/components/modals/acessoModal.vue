<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :title="tipoForm === 'carro' ? 'Acesso Veicular' : 'Acesso Pedestre'"
    :confirmText="isAction"
    @confirm="salvar"
    @close="emit('closeModal')"
    :confirmButton ="loading || (tipoForm === 'carro' ? !isValidCarroForm : false)"
  >
    <template v-if="tipoForm === 'carro'">
      <v-row dense>
        <v-col cols="12" class="text-subtitle-2">UBM: {{ ubm }}</v-col>
        <v-col cols="6">
          <v-text-field v-model="documento" label="Documento" variant="underlined" autofocus />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="placa" label="Placa" :maxlength="7" variant="underlined" :disabled="!modelo" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="nome" label="Condutor" variant="underlined" readonly />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row dense>
        <v-col cols="4">
          <v-text-field v-model="documento" label="Documento" variant="underlined" :readOnly="isReadOnly" :error="showError" autofocus />
        </v-col>
        <v-col cols="4">
          <v-select v-model="doc_id" :items="docOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Tipo" variant="underlined" />
        </v-col>
        <v-col cols="4">
          <v-select v-model="orgao_id" :items="orgaosOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Órgão" variant="underlined" />
        </v-col>
        <v-col cols="4">
          <v-select v-model="gradua_id" :items="tratoOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Posto/Grad" variant="underlined" />
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="nome" label="Nome Completo" :readonly="isReadOnly" variant="underlined" @update:model-value="nome = nome?.toUpperCase()" />
        </v-col>
      </v-row>
    </template>

    <v-row dense>
      <v-col v-if="tipoForm === 'pedestre'" cols="4">
        <v-select v-model="ubm_id" :items="unidadesOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="UBM" variant="underlined" />
      </v-col>
      <v-col :cols="tipoForm === 'pedestre' ? 8 : 12">
        <v-select v-model="destino_id" :items="destinosOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Destino" variant="underlined" />
      </v-col>
    </v-row>

    <v-row v-if="tipoForm === 'carro' && placa" class="mt-4">
      <v-col align="center"><vue-barcode :value="placa" :height="40" /></v-col>
    </v-row>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/modals/BaseModal.vue'
import { useAcessoForm } from '@/composables/useAcessoForm'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})

const emit = defineEmits(['closeModal', 'update:options', 'changeTable'])

const {
  documento, nome, placa, modelo, isAction, showError, loading, ubm,
  doc_id, orgao_id, ubm_id, gradua_id, destino_id,
  docOptions, tratoOptions, orgaosOptions, unidadesOptions, destinosOptions,
  isValidCarroForm, salvar, close:resetForm, isReadOnly
} = useAcessoForm(props, emit)
</script>
