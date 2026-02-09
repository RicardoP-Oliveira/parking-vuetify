<template>
  <BaseModal
    v-if="dialog"
    :isOpen="isDialog"
    :documento="documento"
    title="Controle de acesso"
    :confirmText="isAction"
    :saveData="salvar"
    @confirm="salvar"
    @close="close"
    :confirmButton="!isValidForm"
  >
    <v-row >
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          UBM:
      </v-col>
      <v-col class="px-2 py-1">
          {{ obm }}
      </v-col>  
    </v-row>
    <v-row> 
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Documento:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
          autofocus
          density="compact"
          v-model="documento"
          variant="underlined"
          hide-details
          width="100px"
          @keyup="getUser(documento)"
        />
      </v-col> 
    </v-row>
    <v-row>
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Condutor:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
        density="compact"
        v-model="condutor"
        variant="underlined"
        hide-details
        :rules="[validCondutor]"
        />  
      </v-col>  
    </v-row>
    <v-row>
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Placa:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
        density="compact"
        v-model="placa"
        :rules="[validatePlaca]"
        clearable
        :maxlength="getLength()"
        @click:clear="clearPlaca"
        @keyup="convertToUpper"
        hide-details
        width="150px"
        :variant="placa.length > 0 ? 'plain' : 'underlined'"
        :disabled="modelo.length === 0 ? true : false"
        />
      </v-col>  
    </v-row>
    <v-row >
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Marca/Modelo:
      </v-col>
      <v-col class="px-2 py-1">
          {{ modelo }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Destino:
      </v-col>
      <v-col class="px-2 py-1">
        <v-select
          :items="destinoOptions"
          density="comfortable"
          variant="outlined"
          v-model="destino"
        >
        </v-select>  
      </v-col>  
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row>
      <v-col align="center">
        <vue-barcode :value=placa v-if="placa"></vue-barcode>
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script setup>
import { useCarroForm } from '@/composables/useCarroForm'

const props = defineProps({ dialog: Object })
const emit = defineEmits(['closeModal'])

const {
  placa,
  documento,
  condutor,
  destino,
  modelo,
  destinoOptions,

  validCondutor,
  validatePlaca,

  obm,
  isDialog,
  isAction,
  isValidForm,

  salvar,
  close,
  convertToUpper,
  clearPlaca,
  getLength,
  getUser,
} = useCarroForm(props, emit)
</script>