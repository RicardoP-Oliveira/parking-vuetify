<template>
  <v-row dense>
    <v-col cols="12" md="4">
      <v-card
        class="mx-auto"
        color="surface-variant"
        max-width="344"
        title="Headline"
        subtitle="Greyhound divisely"
      >

      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card
        class="mx-auto"
        color="surface-variant"
        max-width="344"
        title="Headline"
        subtitle="Greyhound divisely"
      >

      </v-card>
    </v-col>
  </v-row>
</template>

<script>


export default {
  props: {
    tab: String,
  },
  name: 'reports',
  emits: ['updateBtn', 'changeTable'],
  mounted() {
    this.$emit('updateBtn', {from: this.$options.name})
    // this.$emmit('changeTable', 'carro')
  }

}
</script>
