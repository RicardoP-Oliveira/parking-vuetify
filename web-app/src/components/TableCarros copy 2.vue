<template>
  <BaseTable
    :data-service="loadCarData"
    :get-header-order="headerOrder"
    :get-columns="setColumns"
    :get-header-groups="setHeaderGroups"
    :filters="filters"
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
  name: 'TableCarros',
  props: {
    tab: String,
    filters: Object, // Recebe a prop filters de default.vue e a passa para BaseTable
  },
  emits: ['update-btn', 'changeTable'],
  methods: {
    async loadCarData(page, itemsPerPage, token, tab, filters) {
      
      const apiFilters = {
        placa: filters.placa,
        documento: filters.documento,
        modelo: filters.modelo,
        condutor: filters.condutor, // Se o filtro 'condutor' for usado para eCondutor

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

      // Limpar filtros nulos para não enviar para a API se não forem necessários
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
  //  watch: {
  //   tab(newTab) {
  //     if (newTab === 'carro') {
  //      this.$refs.baseTableRef.applyFiltersFromParent();
  //     }
  //   }
  // },
};
</script>