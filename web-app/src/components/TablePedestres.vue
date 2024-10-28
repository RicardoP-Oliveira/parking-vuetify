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
  // data() {
  //   return {
  //     modal: {
  //       isOpen: false,
  //     }
  //   }
  // },
  methods: {
    async loadPedestreData(page, itemsPerPage, token, tab) {
      return await this.$pedestreService.getTodos(page, itemsPerPage, token, tab)
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