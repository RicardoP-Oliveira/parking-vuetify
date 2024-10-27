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
        <v-list-item title="Dashboard" link >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-view-dashboard"></v-icon>
              </template>
              Dashboard
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Usuários" link >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-account"></v-icon>
              </template>
              Usuários
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Veículos" link >
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-car"></v-icon>
              </template>
              Veículos
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Militares" link to="/report">
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-shield-account"></v-icon>
              </template>
              Militares
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Estacionamento" link to="/">
          <template v-slot:prepend>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-car-brake-parking"></v-icon>
              </template>
              Estacionamento
            </v-tooltip>
          </template>
        </v-list-item>
        <v-list-item title="Relatórios" link>
            <template v-slot:prepend>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-chart-line"></v-icon>
                </template>
                Relatórios
              </v-tooltip>
            </template>
            <template v-slot:append>
              <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
            </template>
            <v-menu activator="parent" location="end" >
              <v-list density="compact" nav  class="bg-deep-purple">
                <v-list-item title="Serviço 24h" value="report24"  @click="openDialog('Serviço 24h')"/>
                <v-list-item title="Serviço 12h" value="report12" />
              </v-list>
            </v-menu>
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
      <template v-slot:append v-if="isLoggedin">
        <v-btn 
          :text="expToken"
          variant="text"
          class="text-none"
        > {{  expToken }}</v-btn>  
      </template>

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
              <router-view
                @update-btn="updateBtn"
                @changeTable="changeTable"
                :tab="tab"/>
            </v-tabs-window-item>
            <v-tabs-window-item value="pedestre" class="mx-auto my-auto">
              <router-view @update-btn="updateBtn" @changeTable="changeTable" :tab="tab"/>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>

  <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Your application will relaunch automatically after the update is complete."
        :title="titleDialog"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script>

import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
export default {
    provide() {
      return {
        dataTable: this.dataTable,
        tab: this.tab,
        setFalseDataTable: this.setFalseDataTable,
      }
    },
    data: () => ({ 
      drawer: false,
      tab: ref(null),
      focusRico: false,
      dataTable: ref(false),
      isLoggedin: false,
      expToken: '',
      items: 'loadItems',
      dialog: ref(false),
      titleDialog: '',
      interval: null,
    }),
    methods: {
      async updateBtn(info) {
        if (info && info.from.name == 'Table') {
          this.dataTable = true;
          this.isLoggedin = true;
          this.drawer = false
        } else {
          this.dataTable = false;
          this.isLoggedin = true;
          this.drawer = true
        }
        this.getCmte();
        this.getExpirationToken(localStorage.getItem('token'));
      },
      setFalseDataTable() {
        this.dataTable = false;
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
      async openDialog(value) {
        const services = await this.$servicoService.getAll();
        console.log(services)
        const date =  new Date();
        date.setDate(date.getDate() - 1);
        const dateFormated = date.toLocaleDateString();
        this.titleDialog = `${value} - ${dateFormated}`
        this.dialog = true
      },
      changeTable(value) {
        if (value.from === 'infoModal') {
          this.tab = 'carro';
        } else if (value.from === 'infoPedestre') {
          this.tab = 'pedestre';
        } else {
          this.tab = value;
        }
      },
      getExpirationToken(value) {
        const expDecoded = jwtDecode(value);
        const expirationTime = new Date(expDecoded.exp * 1000);
        
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
        // Convertendo expiração para data
        this.interval = setInterval(() => {
          const now = new Date(); 
          const timeRemaining = expirationTime - now; 
          const formattedTime = now.toLocaleTimeString(); 
          if (timeRemaining <= 0) {
            this.expToken = `Token expirado em ${expirationTime.toLocaleDateString()} às ${expirationTime.toLocaleTimeString()}`;
            alert('Seu token expirou. Sendo redirecionado para a tela de login!')
            this.logout();
          } else {
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60)); 
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)); 
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000); 
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            const formattedExpirationDate = expirationTime.toLocaleDateString();
            this.expToken = `Tempo restante: ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
          }
        }, 1000);
      },
      beforeUnmount() {
        clearInterval(this.interval)
        this.interval = null;
      },
      logout() {
        localStorage.clear();
        this.beforeUnmount();
        this.expToken = '';
        this.tab = 'carro';
        this.dataTable = false;
        this.isLoggedin = false;
        this.$router.push({name: 'Login' })
      }
    },
    mounted() {
      this.tab='carro'
    },
  }
</script>
