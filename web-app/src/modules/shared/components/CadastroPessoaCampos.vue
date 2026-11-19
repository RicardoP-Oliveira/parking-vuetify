<template>
  <v-col cols="2">
    <v-text-field :model-value="documento" :label="isVeiculo ? 'Documento do condutor' : 'Documento'" variant="outlined"
      clearable density="compact" @update:model-value="emit('update:documento', limparDocumento($event))"
      @keyup.enter="emit('buscar-dono')" @blur="emit('buscar-dono')" />
  </v-col>

  <v-col v-if="!donoEncontrado" cols="2">
    <v-select v-model="pessoa.tipo_doc_id" :items="docOptions" item-title="title" item-value="id"
      label="Tipo de documento" variant="outlined" density="compact" />
  </v-col>

  <v-col v-if="!donoEncontrado" cols="2">
    <v-autocomplete v-model="pessoa.orgao_id" :items="orgaosOptions" item-title="title" item-value="id"
      label="Órgão emissor" variant="outlined" clearable :disabled="!pessoa.tipo_doc_id" persistent-hint
      density="compact" />
  </v-col>

  <v-col v-if="!donoEncontrado" cols="2">
    <v-select v-model="pessoa.tratamento_id" :items="tratoOptions" item-title="title" item-value="id" label="Tratamento"
      variant="outlined" density="compact" />
  </v-col>

  <v-col cols="4">
    <v-text-field :model-value="nome" label="Nome completo" variant="outlined" density="compact"
      @update:model-value="emit('update:nome', ($event || '').toUpperCase())" />
  </v-col>

  <v-col cols="12">
    <v-fade-transition mode="out-in">
      <div v-if="donoEncontrado && documento?.length" key="dono">
        <v-alert v-if="isVeiculo && info" type="success" variant="tonal" icon="mdi-account-check" density="compact">
          {{ info.prefixo }} <strong>{{ info.nome }}</strong>
        </v-alert>
      </div>

      <div v-else-if="documento && documento.length > 3" key="avulso">
        <v-row>
          <v-col cols="3">
            <v-autocomplete v-model="pessoa.unidade_id" :items="unidadesOptions" label="Unidade" variant="outlined"
              item-title="title" item-value="id" density="compact" />
          </v-col>
        </v-row>
      </div>
    </v-fade-transition>
  </v-col>
</template>

<script setup>
defineProps({
  pessoa: { type: Object, required: true },
  documento: { type: String, default: '' },
  nome: { type: String, default: '' },
  donoEncontrado: { type: Object, default: null },
  isVeiculo: { type: Boolean, default: false },
  info: { type: Object, default: null },
  docOptions: { type: Array, default: () => [] },
  orgaosOptions: { type: Array, default: () => [] },
  tratoOptions: { type: Array, default: () => [] },
  unidadesOptions: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:documento',
  'update:nome',
  'buscar-dono',
])

const limparDocumento = (valor) =>
  String(valor || '').replace(/\D/g, '')
</script>