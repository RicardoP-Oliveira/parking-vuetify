<template>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>
    <v-card
      class="mx-auto pa-12 pb-8 mb-1"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <v-alert
        type="error"
        v-if="hide"
        @click="hide = !hide"
      >
        {{ this.error }}
      </v-alert>
      <div class="text-subtitle-1 text-medium-emphasis">Usuário</div>

      <v-text-field
        density="compact"
        v-model="formLogin.documento"
        placeholder="RG"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        v-model="formLogin.password"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="logar()"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
</template>
<script>

export default {
  data: () => ({
    hide: false,
    visible: false,
    formLogin: {
      documento: '',
      password: '',
    },
    error: undefined,
  }),
  methods: {
    async logar() {
      try {
        const res = await this.$sessionservice.logar(this.formLogin);
        if (res.error) { 
          this.error = res.error;
          this.hide = true;
          this.$router.push({name: '/login' }); 
        } else {
            if (res.token) {
              localStorage.setItem('token', res.token)
              this.$router.push({ name: '/' } ) 
            } else {
              this.$router.push(from)
            }
          }
        } catch (error) {
        // Tratamento de erros inesperados, como falhas de rede
        console.error(error)
        this.error = error;
        this.hide = true;
      }
    }
  }
}
</script>