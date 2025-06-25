<template>
  <v-app>
    <v-main class="flex-grow-1 d-flex flex-column">
      <router-view  @show-snackbar="showSnackbar"/>
    </v-main>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      rounded="pill"
      location="center" >

      {{ snackbar.message }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

  const snackbar = ref ({
    show: false,
    message: '',
    color: 'red-dark',
    timeout: 2000,
  });

  const showSnackbar = (options) => {
    snackbar.value.message = options.message || '';
    snackbar.value.color = options.color || 'red-dark';
    snackbar.value.timeout = options.timeout || 2000;
    snackbar.value.show = true;
  };

</script>
