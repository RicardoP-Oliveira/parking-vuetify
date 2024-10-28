<template>
  <BaseTable
    :data-service="loadCarData"
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
  name: 'TableCarros',
  // data() {
  //   return {
  //     modal: {
  //       isOpen: false,
  //       idPlaca: '',
  //       type: null
  //     }
  //   }
  // },
  methods: {
    async loadCarData(page, itemsPerPage, token, tab) {
      return await this.$ceicsservice.getTodos(page, itemsPerPage, token, tab)
    },
    headerOrder(){
      return [
        'placa', 
        'marcaModelo', 
        'entrada', 
        'destino', 
        'saida',
      ]
    },
    setColumns(){
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
      }
      return headerGroups
    }
  }
}
</script>