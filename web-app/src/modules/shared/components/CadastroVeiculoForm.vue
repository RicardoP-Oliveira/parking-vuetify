<template>
  <v-col cols="2">
    <v-text-field v-model="veiculo.placa" label="Placa" variant="outlined" density="compact"
      @update:model-value="veiculo.placa = ($event || '').toUpperCase()" />
  </v-col>
  <v-col cols="2">
    <v-text-field v-model="veiculo.prefixo" label="Prefixo (se viatura)" variant="outlined" density="compact"
      :disabled="!isVtr" @update:model-value="veiculo.prefixo = ($event || '').toUpperCase()" />
  </v-col>

  <v-col cols="3">
    <v-text-field v-model="veiculo.marca" label="Modelo (opcional)" variant="outlined" density="compact"
      @update:model-value="veiculo.marca = ($event || '').toUpperCase()" />
  </v-col>

  <v-col cols="2">
    <v-switch :model-value="isVtr" color="primary" label="Viatura Oficial" class="m-0"
      @update:model-value="emit('update:isVtr', $event)" />
  </v-col>

  <v-col v-if="isVtr" cols="3">
    <v-autocomplete v-model="veiculo.orgao_id" :items="orgaosOptions" item-title="title" item-value="id"
      label="Órgão da viatura" variant="outlined" clearable :hint="hintOrgao" persistent-hint density="compact" />
  </v-col>

  <v-col v-if="veiculo.orgao_id" cols="12">
    <v-alert type="info" variant="tonal">
      <v-icon start>mdi-car-estate</v-icon>
      <strong>Viatura Oficial</strong> pertencente ao órgão:
      <strong>
        {{orgaosOptions.find(o => o.id === veiculo.orgao_id)?.title}}
      </strong>
    </v-alert>
  </v-col>

  <v-col cols="12">
    <v-divider class="my-2" />
  </v-col>

  <CadastroPessoaCampos :pessoa="pessoa" :documento="documento" :nome="nome" :dono-encontrado="donoEncontrado"
    :is-veiculo="true" :info="info" :doc-options="docOptions" :orgaos-options="orgaosOptions"
    :trato-options="tratoOptions" :unidades-options="unidadesOptions"
    @update:documento="emit('update:documento', $event)" @update:nome="emit('update:nome', $event)"
    @buscar-dono="emit('buscar-dono')" />
</template>

<script setup>
import CadastroPessoaCampos from './CadastroPessoaCampos.vue'

defineProps({
  veiculo: { type: Object, required: true },
  pessoa: { type: Object, required: true },
  isVtr: { type: Boolean, default: false },
  documento: { type: String, default: '' },
  nome: { type: String, default: '' },
  donoEncontrado: { type: Object, default: null },
  info: { type: Object, default: null },
  orgaosOptions: { type: Array, default: () => [] },
  docOptions: { type: Array, default: () => [] },
  tratoOptions: { type: Array, default: () => [] },
  unidadesOptions: { type: Array, default: () => [] },
  hintOrgao: { type: String, default: '' },
})

const emit = defineEmits([
  'update:isVtr',
  'update:documento',
  'update:nome',
  'buscar-dono',
])
</script>