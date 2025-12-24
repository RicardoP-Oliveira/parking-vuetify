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

export default {
  components: {
    BaseTable,
  },
  name: 'TablePedestres', // Certifique-se de que o nome está correto
  props: {
    tab: String,
    filters: Object, // Adicione esta prop
  },
  methods: {
      async loadPedestreData(page, itemsPerPage, token, tab, filters) {
      const apiFilters = {
        documento: filters.documento,
        // Lógica condicional para nome (apenas pedestres)
        pedestre: filters.condutor, 
        dataInicio: filters.dataInicio ? filters.dataInicio.toISOString().split('T')[0] : null,
        dataFim: filters.dataFim ? filters.dataFim.toISOString().split('T')[0] : null,
        horaInicio: filters.horaInicio,
        horaFim: filters.horaFim,
      };

      // Limpar filtros nulos
      for (const key in apiFilters) {
        if (apiFilters[key] === null || apiFilters[key] === '') {
          delete apiFilters[key];
        }
      }

      return await this.$pedestreService.getTodos(page, itemsPerPage, token, tab, apiFilters);
    },
    headerOrder() {
      return ['tDoc', 'nDoc', 'name', 'destino', 'entrada', 'saida']; // Exemplo de ordem de cabeçalho para pedestres
    },
    setColumns() {
      return [
        'tDoc',
        'nDoc',
        'name',
        'destino',
        'entrada',
        'hEntrada',
        'saida',
        'hSaida',
      ]; // Exemplo de colunas para pedestres
    },
    setHeaderGroups() {
      const headerGroups = {
        entrada: {
          title: 'Entrada',
          children: [
            { key: 'entrada', title: 'Data' },
            { key: 'hEntrada', title: 'Hora' },
          ],
        },
        saida: {
          title: 'Saída',
          children: [
            { key: 'saida', title: 'Data' },
            { key: 'hSaida', title: 'Hora' },
          ],
        },
      };
      return headerGroups;
    },
  },
};
</script>