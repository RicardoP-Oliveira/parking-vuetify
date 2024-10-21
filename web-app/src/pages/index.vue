<template>
  <TableCarros v-if="tab === 'carro'"/>
  <TablePedestres v-else />
</template>
<script>
import DataTablePedest from '@/components/DataTablePedest.vue';

 export default {
  data() {
    return {
      tab: null,
    }
  },
   methods: {
     getInfo() {
      this.tab = this.$attrs.tab || 'carro';
     },
   },
   mounted() {
     this.getInfo()
   }
 }
</script>
