<template>
  <BaseModal
    v-if="dialog"
    :isOpen="dialog.isDialog"
    :documento="documento"
    :confirmText="isAction"
    title="Controle de Pedestres"
    @confirm="salvar"
    @close="close"
  >
    <v-row>
      <v-col class="px-2 py-1">
        <v-text-field
          autofocus
          label="Documento"
          variant="underlined"
          v-model="documento"
          :error="showError"
          :error-messages="errorMessage"
          @blur="formTouched = true"
        />
      </v-col>

      <v-col class="px-2 py-1">
        <v-select
          :items="docOptions"
          item-title="sigla"
          item-value="id"
          label="Tipo Doc"
          variant="underlined"
          v-model="idDoc"
        />
      </v-col>

      <v-col class="px-2 py-1">
        <v-select
          :items="orgaosOptions"
          item-title="orgao"
          item-value="id"
          label="Órgão"
          variant="underlined"
          v-model="idOrgao"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="tratoOptions"
          item-title="abrev"
          item-value="id"
          label="Posto/Grad/Tratam"
          variant="underlined"
          v-model="idGradua"
        />
      </v-col>

      <v-col class="px-2 py-1">
        <v-text-field
          label="Nome"
          variant="underlined"
          v-model="nome"
          :error="!nome && formTouched"
          :error-messages="!nome && formTouched ? '* Obrigatório' : ''"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="unidadesOptions"
          item-value="id"
          item-title="name"
          label="UBM"
          variant="underlined"
          v-model="idUbm"
        />
      </v-col>

      <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="destinoOptions"
          label="Destino"
          variant="underlined"
          v-model="destino"
          :error="!destino && formTouched"
          :error-messages="!destino && formTouched ? '* Obrigatório' : ''"
        />
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/modals/BaseModal.vue'
import { usePedestreForm } from '@/composables/usePedestreForm'

const props = defineProps({
  dialog: { type: Object, required: true }
})

const emit = defineEmits(['closeModal'])

const {
  documento,
  idDoc,
  idOrgao,
  nome,
  idUbm,
  idGradua,
  destino,
  isAction,
  formTouched,

  docOptions,
  tratoOptions,
  orgaosOptions,
  unidadesOptions,
  destinoOptions,

  isPedestre,
  showError,
  errorMessage,

  salvar,
  close
} = usePedestreForm(props, emit)
</script>

