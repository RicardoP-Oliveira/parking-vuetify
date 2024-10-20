<template>
   <!-- Navigation Drawer fixo à esquerda -->
   <v-navigation-drawer
      v-if="isLoggedin"
      v-model="drawer"
      class="bg-deep-purple"
    >
      <v-list>
        <v-list-item nav class="mx-auto px-auto text-center">
          <template v-slot:prepend>
            <v-avatar color="" theme="dark" size="36px">
              <v-icon size="40px" icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </template>
            <v-list-item-title>{{ cmte }}</v-list-item-title>
            <v-list-item-subtitle>{{ documento }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- Listas de navegação -->
      <v-list density="compact" nav>
        <v-list-item title="Dashboard" value="mydashboard" >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-view-dashboard"></v-icon>
              </template>
              Dashboard
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Usuários" value="mysusers" >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-account"></v-icon>
              </template>
              Usuários
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Veículos" value="mycars" >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-car"></v-icon>
              </template>
              Veículos
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Militares" value="militarys" >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-shield-account"></v-icon>
              </template>
              Militares
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Estacionamento" value="parking" to="/">
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-car-brake-parking"></v-icon>
              </template>
              Estacionamento
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Relatórios" value="report" >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-chart-line"></v-icon>
              </template>
              Relatórios
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append v-if="isLoggedin">
        <v-list density="compact">
          <v-list-item title="Logout" value="exit" @click="logout">
            <template v-slot:prepend>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-logout"></v-icon>
                </template>
                Sair
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- App Bar fixo no topo -->
    <v-app-bar color="bg-greey-light" flat height="75" elevation="2">
      <v-app-bar-nav-icon
        icon="mdi-dots-vertical"
        @click="drawer = !drawer"
        elevation="1"
        size="small"
        class="mr-3 ms-3"
      />
      <v-app-bar-title :text="$route.name" />

      <template v-slot:extension v-if="dataTable">
        <v-col>
          <v-tabs v-model="tab" fixed-tabs >
            <v-tab prepend-icon="mdi-car" value="carro">Veículos</v-tab>
            <v-tab prepend-icon="mdi-walk" value="pedestre">Pedestres</v-tab>
          </v-tabs>
        </v-col>
      </template>
    </v-app-bar>
  <v-layout>
   

    <!-- Conteúdo principal -->
    <v-main>
      <v-card>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="carro">
              <router-view @update-btn="updateBtn" @changeTable="changeTable" :tab="tab"/>
            </v-tabs-window-item>
            <v-tabs-window-item value="pedestre" class="mx-auto my-auto">
              <router-view @update-btn="updateBtn" @changeTable="changeTable" :tab="tab"/>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script>

import { jwtDecode } from 'jwt-decode'
export default {
    provide() {
      return {
        dataTable: this.dataTable,
      }
    },
    data: () => ({ 
      drawer: false,
      tab: null,
      focusRico: false,
      dataTable: false,
      isLoggedin: false,
      expToken: '',
      items: 'loadItems'
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

        this.getCmte();
        // this.getExpirationToken(localStorage.getItem('token'));
      },

      getCmte() {
        if(localStorage.getItem('token')) {
          const decoded = jwtDecode(localStorage.getItem('token'));

          if(decoded.isLoggedin) {
            this.documento = decoded.documento;
            this.gradua = decoded.gradua;
            this.orgao = decoded.orgao;
            this.nGuerra = decoded.nGuerra;
            this.cmte = `${this.gradua} ${this.orgao} ${this.nGuerra}`;
          }
          
        }
      },

      changeTable(value) {
        if (value.from === 'infoModal') {
          this.tab = 'carro';
        } else {
          this.tab = 'pedestre';
        }
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
        this.tab = 'carro';
        this.dataTable = false;
        this.isLoggedin = false;
        this.$router.push('/login')
      }
    },
    mounted() {
      this.tab='carro'
    },
  }
</script>