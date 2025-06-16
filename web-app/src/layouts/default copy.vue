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
          variant="text"
          class="text-none"
        ></v-btn>  
      </template>

      <template v-slot:extension>
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
      max-width="720"
      :services="services"
    >
      <v-card
        max-width="720"
        prepend-icon="mdi-update"
        :title="titleDialog"
      >
        <v-card-text>
          <v-list>
            <v-list-item  v-for="(item, index) in services.dados" :key="index">
              <v-row align="center">
                <v-col>RG: {{ item.rg }}</v-col>
                <v-col>Início: {{ item.dataInicio }}</v-col>
                <v-col>Hora: {{ item.horaInicio }}</v-col>
                <v-col>Término: {{ item.dataTermino ? item.dataTermino : 'Aberto'}}</v-col>
                <v-col><v-btn @click="listarServico(item)">Detalhes</v-btn></v-col>
              </v-row>   
            </v-list-item>
          </v-list>
        </v-card-text>
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
import { dateFormatterOutput } from '@/js/maxMin';
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
      tab: 'carro',
      services: [],
      focusRico: false,
      dataTable: ref(false),
      isLoggedin: false,
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

        }
      },
      setFalseDataTable() {
        this.dataTable = false;
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
      logout() {
        localStorage.clear();
        this.beforeUnmount();
        this.expToken = '';
        this.tab = 'carro';
        this.dataTable = false;
        this.isLoggedin = false;
        this.$router.push({name: 'Login' })
      },
    }
  }
</script>