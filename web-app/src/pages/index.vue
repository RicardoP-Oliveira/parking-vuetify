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
  import BaseTable from '@/components/tables/BaseTable.vue'
  import { useCarroTable } from '@/composables/useCarroTable'
  import { usePedestreTable } from '@/composables/usePedestreTable'

  const props = defineProps(['tab', 'filters'])

  const emit = defineEmits(['update-btn', 'changeTable', 'show-snackbar'])

  const { proxy } = getCurrentInstance()
  const ceics = proxy.$ceicsservice

  const { loadCarData } = useCarroTable(ceics)
  const { loadPedestreData } = usePedestreTable(ceics)

  const currentDataService = computed(() => {
    return props.tab === 'carro' ? loadCarData : loadPedestreData
  })
</script>