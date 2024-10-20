<template>
  <TableCarros v-if="tab === 'carro'"/>
  <TablePedestres v-else />
</template>
<script>
 export default {
  data() {
    return {
      tab: null,
    }
  },
   methods: {
     getInfo() {
      this.tab = this.$attrs.tab || 'car';
     }
   },
   mounted() {
     this.getInfo()
   }
 }
</script>
