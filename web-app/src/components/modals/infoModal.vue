<template>
  <BaseModal
    v-if="dialog"
    :isOpen="isDialog"
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
        v-model="condutorResolved"
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
      <v-col class="px-0 py-2 font-weight-bold" align="end">
          Destino:
      </v-col>
      <v-col class="px-2 py-0">
        <v-select
          :items="destinoOptions"
          item-value="target"
          density="compact"
          variant="underlined"
          width="120px"
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
import { useBaseTable } from '@/composables/useBaseTable';

const props = defineProps({ dialog: Object, tipo: String })
const emit = defineEmits(['closeModal'])

const {
  placa,
  documento,
  condutorResolved,
  destino,
  modelo,
  destinoOptions,
  obm,
  isDialog,
  isAction,
  isValidForm,
  salvar,
  close,
  clearPlaca,
  getLength,
  validCondutor,
  validatePlaca
} = useCarroForm(props, emit)
</script>