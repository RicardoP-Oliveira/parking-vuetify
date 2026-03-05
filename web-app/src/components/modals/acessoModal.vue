<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :title="tipoForm === 'carro' ? 'Acesso Veicular' : 'Acesso Pedestre'"
    :confirmText="isAction"
    @confirm="salvar"
    @close="emit('closeModal')"
    :confirmButton ="loading || !isFormValid"
  >
    <template v-if="tipoForm === 'carro'">
      <v-row dense>
        <v-col cols="6">
          <v-text-field v-model="documento" :label="labelDocumento" variant="underlined" autofocus />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="placa" label="Placa" readonly :maxlength="7" variant="underlined" :disabled="!modelo" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="nome" label="Condutor" variant="underlined" readonly />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row dense>
        <v-col cols="4">
          <v-text-field v-model="documento" :label="labelDocumento" variant="underlined" :readOnly="isReadOnly" :error="showError" autofocus />
        </v-col>
        <!-- <v-col cols="4">
          <v-select v-model="doc_id" :items="docOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Tipo" variant="underlined" />
        </v-col>
        <v-col cols="4">
          <v-select v-model="orgao_id" :items="orgaosOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Órgão" variant="underlined" />
        </v-col>
        <v-col cols="4">
          <v-select v-model="gradua_id" :items="tratoOptions" :readonly="isReadOnly" item-title="title" item-value="id" label="Posto/Grad" variant="underlined" />
        </v-col> -->
        <v-col cols="8">
          <v-text-field v-model="nome" label="Nome" readonly variant="underlined" @update:model-value="nome = nome?.toUpperCase()" />
        </v-col>
      </v-row>
    </template>

    <v-row dense>
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
import { nextTick, watch } from 'vue'

const props = defineProps({
  dialog: Object,
  tipoForm: String,
  tipo: String
})

const modalRef = ref(null)

const emit = defineEmits(['closeModal', 'update:options', 'changeTable', 'abrirCadastroCarro'])

const {
  documento, nome, placa, modelo, isAction, showError, loading, ubm,
  doc_id, orgao_id, ubm_id, gradua_id, destino_id, tipo_doc, labelDocumento,
  docOptions, tratoOptions, orgaosOptions, unidadesOptions, destinosOptions,
  isValidCarroForm, salvar, close:resetForm, isReadOnly, isFormValid,
  isValidPedestreForm
} = useAcessoForm(props, emit)

watch(() => isFormValid.value, async(valido) => {
  if (valido) {
    await nextTick()
    const btn = modalRef.value?.confirmButtonRef
    if (btn) {
      const el = btn.$el || btn
      el.focus()
    }
  }
})
</script>
