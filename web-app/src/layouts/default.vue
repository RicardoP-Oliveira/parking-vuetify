<template>
  <v-card>
    <v-app-bar permanent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-center me-15 text-h5">Controle de Acesso CEICS</v-app-bar-title>
      <template v-slot:append v-if="isLoggedin">
        <v-divider vertical></v-divider>
        <v-btn
         class="text-none"
         @click="logout"
        >
          Logout
      </v-btn>  
      </template>
      <template v-slot:extension v-if="dataTable">
        <v-col>
          <v-tabs 
            v-model="tab"
            fixed-tabs
          >
            <v-tab  prepend-icon="mdi-car" value="car">Veículos</v-tab>
            <v-tab prepend-icon="mdi-walk" value="pedestrian">Pedestres</v-tab>
          </v-tabs>
        </v-col>      
      </template>
      
    </v-app-bar>
    <v-navigation-drawer app permanent v-model="drawer">
        <v-list>
          <v-list-item title="Dashboard"></v-list-item>
          <v-list-item title=""></v-list-item>
        </v-list>
      </v-navigation-drawer>
    <v-app>
      
    <v-main>
      <v-card-text>
        
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="car">
            <router-view @update-btn="updateBtn"/>         
          </v-tabs-window-item>
          <v-tabs-window-item value="pedestrian" class="mx-auto my-auto">
            <p class="text-h2">TRANSEUNTES</p>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      
    </v-main>
    </v-app>
  </v-card>
</template>

<script>

import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
const drawer  = ref(null)
export default {
    provide() {
      return {
        dataTable: this.dataTable,
      }
    },
    data: () => ({ 
      drawer: false,
      tab: 'car',
      dataTable: false,
      isLoggedin: false,
      expToken: '',
    }),
    methods: {
      async updateBtn(info) {
        if (this.dataTable) {
          await this.$router.push({path:'/' })
        } else if (info && info.from.name == 'Table') {
          this.dataTable = true;
          this.isLoggedin = true;
        } else {
          this.isLoggedin = true;
        }
        // this.getExpirationToken(localStorage.getItem('token'));
      },

      // getExpirationToken(value) {
      //   const expDecoded = jwtDecode(value);
      //   const expirationTime = new Date(expDecoded.exp * 1000); // Convertendo expiração para data

      //   this.interval = setInterval(() => {
      //     const now = new Date();  // Obtém a hora atual
      //     const timeRemaining = expirationTime - now; // Diferença em milissegundos

      //     // Hora atual formatada
      //     const formattedTime = now.toLocaleTimeString(); // Atualiza a cada segundo

      //     if (timeRemaining <= 0) {
      //       clearInterval(this.interval); // Para o relógio quando o tempo expirar
      //       this.expToken = `Token expirado em ${expirationTime.toLocaleDateString()} às ${expirationTime.toLocaleTimeString()}`;
      //       alert('Seu token expirou. Sendo redirecionado para a tela de login!')
      //       this.logout();
      //     } else {
      //       // Cálculo das horas, minutos e segundos restantes
      //       const hours = Math.floor(timeRemaining / (1000 * 60 * 60)); // Converte para horas
      //       const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)); // Minutos restantes
      //       const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000); // Segundos restantes

      //       // Zeros à esquerda para minutos e segundos
      //       const formattedHours = String(hours).padStart(2, '0');
      //       const formattedMinutes = String(minutes).padStart(2, '0');
      //       const formattedSeconds = String(seconds).padStart(2, '0');

      //       // Data de Expiração Formatada
      //       const formattedExpirationDate = expirationTime.toLocaleDateString();

      //       // Exibe a contagem regressiva no formato HH:mm:ss
      //       this.expToken = `O token expira em ${formattedExpirationDate} - ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      //   }}, 1000);
      // },

      beforeUnmount() {
        clearInterval(this.interval)
      },

      logout() {
        localStorage.clear();
        this.beforeUnmount();
        this.expToken = '';
        this.tab = 'car';
        this.dataTable = false;
        this.isLoggedin = false;
        this.$router.push('/login')
      }

    },
  }
</script>