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
import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    BaseTable,
  },
  name: 'TableCarros', // Confirme que o nome do componente é 'TableCarros'
  props: {
    tab: String, // Recebe a prop 'tab' do layout.vue
    filters: Object, // Recebe a prop filters do layout.vue
  },
  emits: ['update-btn', 'changeTable'],
  methods: {
    async loadCarData(page, itemsPerPage, token, tab, filters) {
      const apiFilters = {
        placa: filters.placa,
        documento: filters.documento,
        modelo: filters.modelo,
        condutor: filters.condutor,

        dataEntradaInicio: filters.dataEntradaInicio
          ? filters.dataEntradaInicio.toISOString().split('T')[0]
          : null,
        dataEntradaFim: filters.dataEntradaFim ? filters.dataEntradaFim.toISOString().split('T')[0] : null,
        dataSaidaInicio: filters.dataSaidaInicio ? filters.dataSaidaInicio.toISOString().split('T')[0] : null,
        dataSaidaFim: filters.dataSaidaFim ? filters.dataSaidaFim.toISOString().split('T')[0] : null,
        horaEntradaInicio: filters.horaEntradaInicio,
        horaEntradaFim: filters.horaEntradaFim,
        horaSaidaInicio: filters.horaSaidaInicio,
        horaSaidaFim: filters.horaSaidaFim,
      };

      for (const key in apiFilters) {
        if (apiFilters[key] === null || apiFilters[key] === '') {
          delete apiFilters[key];
        }
      }
      return await this.$ceicsservice.getTodos(page, itemsPerPage, token, tab, apiFilters);
    },
    headerOrder() {
      return ['placa', 'marcaModelo', 'entrada', 'destino', 'saida'];
    },
    setColumns() {
      return [
        'placa',
        'marcaModelo',
        'entrada',
        'hEntrada',
        'eRg',
        'eCondutor',
        'saida',
        'hSaida',
        'sRg',
        'sCondutor',
        'destino',
      ];
    },
    setHeaderGroups() {
      const headerGroups = {
        entrada: {
          title: 'Entrada',
          children: [
            { key: 'entrada', title: 'Data' },
            { key: 'hEntrada', title: 'Hora' },
            { key: 'eRg', title: 'Documento' },
            { key: 'eCondutor', title: 'Condutor' },
          ],
        },
        saida: {
          title: 'Saída',
          children: [
            { key: 'saida', title: 'Data' },
            { key: 'hSaida', title: 'Hora' },
            { key: 'sRg', title: 'Documento' },
            { key: 'sCondutor', title: 'Condutor' },
          ],
        },
      };
      return headerGroups;
    },
  },
};
</script>
