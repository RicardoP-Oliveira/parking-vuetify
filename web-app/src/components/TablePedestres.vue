<template>
  <BaseTable
    :data-service="loadPedestreData"
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
import BaseTable from '@/components/BaseTable.vue';
import {usePedestreTable} from '@/composables/usePedestreTable';

export default {
  name: 'TablePedestres',
  components: {
    BaseTable,
  },
  props: {
    tab: String,
    filters: Object,
  },
  setup(_, { emit }) {
    const {
      loadPedestreData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    } = usePedestreTable(
      getCurrentInstance().proxy.$pedestreService
    );

    return {
      loadPedestreData,
      headerOrder,
      setColumns,
      setHeaderGroups,
    };
  },
};
</script>