<template>
  <BaseTable
    :data-service="loadPedestreData"
    :get-header-order="headerOrder"
    :get-columns="setColumns"
    :get-header-groups="setHeaderGroups"
  />
</template>

<script>
import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    BaseTable
  },
  name: 'TablePedestres',
  methods: {
    async loadPedestreData(page, itemsPerPage, token, tab, filters) {
      const apiFilters = {
        documento: filters.documento,
        // Lógica condicional para nome (apenas pedestres)
        pedestre: filters.condutor, 
        dataEntradaInicio: filters.dataEntradaInicio ? filters.dataEntradaInicio.toISOString().split('T')[0] : null,
        dataEntradaFim: filters.dataEntradaFim ? filters.dataEntradaFim.toISOString().split('T')[0] : null,
        dataSaidaInicio: filters.dataSaidaInicio ? filters.dataSaidaInicio.toISOString().split('T')[0] : null,
        dataSaidaFim: filters.dataSaidaFim ? filters.dataSaidaFim.toISOString().split('T')[0] : null,
        horaEntradaInicio: filters.horaEntradaInicio,
        horaEntradaFim: filters.horaEntradaFim,
        horaSaidaInicio: filters.horaSaidaInicio,
        horaSaidaFim: filters.horaSaidaFim,
      };

      // Limpar filtros nulos
      for (const key in apiFilters) {
        if (apiFilters[key] === null || apiFilters[key] === '') {
          delete apiFilters[key];
        }
      }

      return await this.$pedestreService.getTodos(page, itemsPerPage, token, tab, apiFilters);
    },
    headerOrder(){
      return [
        'name', 
        'tDoc', 
        'nDoc', 
        'entrada',
        'destino', 
        'saida',
      ]
    },
    setColumns(){
      return [
        'name',
        'tDoc',
        'nDoc',
        'entrada',
        'hEntrada',
        'saida',
        'hSaida',
        'destino'
      ]
    },
    setHeaderGroups(){
      const  headerGroups = {
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
      }
      return headerGroups
    }
  }
}
</script>