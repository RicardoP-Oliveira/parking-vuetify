<template>
  <CadastroPessoaCampos :pessoa="pessoa" :documento="documento" :nome="nome" :dono-encontrado="donoEncontrado"
    :doc-options="docOptions" :orgaos-options="orgaosOptions" :trato-options="tratoOptions"
    :unidades-options="unidadesOptions" @update:documento="emit('update:documento', $event)"
    @update:nome="emit('update:nome', $event)" @buscar-dono="emit('buscar-dono')" />
</template>

<script setup>
import CadastroPessoaCampos from './CadastroPessoaCampos.vue'

defineProps({
  pessoa: { type: Object, required: true },
  documento: { type: String, default: '' },
  nome: { type: String, default: '' },
  donoEncontrado: { type: Object, default: null },
  orgaosOptions: { type: Array, default: () => [] },
  docOptions: { type: Array, default: () => [] },
  tratoOptions: { type: Array, default: () => [] },
  unidadesOptions: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:documento',
  'update:nome',
  'buscar-dono',
])
</script>