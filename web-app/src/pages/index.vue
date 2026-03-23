<!-- src/pages/index.vue-->
<template>
  <BaseTable 
    :tab="tab"
    :filters="filters"
    :data-service="currentDataService"
    @update-btn="$emit('update-btn', $event)"
    @changeTable="$emit('changeTable', $event)"
    @show-snackbar="$emit('show-snackbar', $event)"
  />  
</template>

<script setup>
  import { computed, getCurrentInstance } from 'vue'
  import BaseTable from '@/modules/shared/components/BaseTable.vue'
  import { useVeiculoTable } from '@/modules/carro/presentation/composables/useVeiculoTable'
  import { usePedestreTable } from '@/modules/pedestre/presentation/composables/usePedestreTable'

  const props = defineProps(['tab', 'filters'])

  const emit = defineEmits(['update-btn', 'changeTable', 'show-snackbar'])

  const { proxy } = getCurrentInstance()
  const movimentacao = proxy.$movimentacaoService

  const { loadCarData } = useVeiculoTable(movimentacao)
  const { loadPedestreData } = usePedestreTable(movimentacao)

  const currentDataService = computed(() => {
    return props.tab === 'VEICULO' ? loadCarData : loadPedestreData
  })
</script>