<template>
  <BaseTable
    ref="baseTableRef"
    :tab="tab"
    :filters="filters"
    :data-service="loadCarData"
    :get-header-order="headerOrder"
    :get-columns="setColumns"
    :get-header-groups="setHeaderGroups"
    @update-btn="$emit('update-btn', $event)"
    @changeTable="$emit('changeTable', $event)"
  />
</template>

<script>
import { getCurrentInstance } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
import { useCarroTable } from '@/composables/useCarroTable';

export default {
  name: 'TableCarros',
  components: {
    BaseTable,
  },
  props: {
    tab: String,
    filters: Object,
  },
  setup(_, { emit }){
    const { proxy } = getCurrentInstance()

    const {
      loadCarData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    } = useCarroTable(proxy.$ceicsservice)

    return {
      loadCarData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    }
  }
}
</script>