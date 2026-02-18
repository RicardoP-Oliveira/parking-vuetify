<template>
  <BaseTable
    :data-service="loadCarData"
    :get-header-order="headerOrder"
    :get-columns="setColumns"
    :get-header-groups="setHeaderGroups"
    :filters="filters"
    :tab="tab"
    @update-btn="$emit('update-btn', $event)"
    @changeTable="$emit('changeTable', $event)"
    ref="baseTableRef"
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
  emits: ['update-btn', 'changeTable'],
  setup() {
    const { proxy } = getCurrentInstance();

    const {
      loadCarData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    } = useCarroTable(proxy.$ceicsservice);

    return {
      loadCarData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    };
  },
};
</script>
