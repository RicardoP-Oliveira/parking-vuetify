<template>
  <v-navigation-drawer v-if="isLoggedin" v-model="drawer" class="bg-deep-purple">
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

    <v-list density="compact" nav class="px-4">
      <v-list-item>
        <v-text-field
          v-model="filters.placa"
          label="Placa"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('placa')"
          @keyup.enter="applyFilters"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="filters.documento"
          label="Documento"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('documento')"
          @keyup.enter="applyFilters"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="filters.modelo"
          label="Modelo"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('modelo')"
          @keyup.enter="applyFilters"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="filters.condutor"
          :label="tab === 'carro' ? 'Condutor' : 'Nome'"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('condutor')"
          @keyup.enter="applyFilters"
        ></v-text-field>
      </v-list-item>

      <v-list-item>
        <v-menu v-model="menuEntradaData" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="
                filters.dataEntradaInicio
                  ? new Date(filters.dataEntradaInicio).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Entrada Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataEntradaInicio')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataEntradaInicio"
            show-adjacent-months
            @update:model-value="
              menuEntradaData = false;
              applyFilters();
            "
            :hide-header="true"
          ></v-date-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuEntradaDataFim" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="
                filters.dataEntradaFim
                  ? new Date(filters.dataEntradaFim).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Entrada Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataEntradaFim')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataEntradaFim"
            show-adjacent-months
            @update:model-value="
              menuEntradaDataFim = false;
              applyFilters();
            "
            :hide-header="true"
          ></v-date-picker>
        </v-menu>
      </v-list-item>

      <v-list-item>
        <v-menu v-model="menuSaidaData" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="
                filters.dataSaidaInicio
                  ? new Date(filters.dataSaidaInicio).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Saída Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataSaidaInicio')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataSaidaInicio"
            show-adjacent-months
            @update:model-value="
              menuSaidaData = false;
              applyFilters();
            "
            :hide-header="true"
          ></v-date-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuSaidaDataFim" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="
                filters.dataSaidaFim
                  ? new Date(filters.dataSaidaFim).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Saída Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataSaidaFim')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataSaidaFim"
            show-adjacent-months
            @update:model-value="
              menuSaidaDataFim = false;
              applyFilters();
            "
            :hide-header="true"
          ></v-date-picker>
        </v-menu>
      </v-list-item>

      <v-list-item>
        <v-menu v-model="menuEntradaHora" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaEntradaInicio"
              label="Hora Entrada Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaEntradaInicio')"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaEntradaInicio"
            format="24hr"
            @update:model-value="applyFilters()"
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuEntradaHoraFim" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaEntradaFim"
              label="Hora Entrada Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaEntradaFim')"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaEntradaFim"
            format="24hr"
            @update:model-value="
              menuEntradaHoraFim = false;
              applyFilters();
            "
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuSaidaHora" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaSaidaInicio"
              label="Hora Saída Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaSaidaInicio')"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaSaidaInicio"
            format="24hr"
            @update:model-value="applyFilters()"
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuSaidaHoraFim" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaSaidaFim"
              label="Hora Saída Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaSaidaFim')"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaSaidaFim"
            format="24hr"
            @update:model-value="
              menuSaidaHoraFim = false;
              applyFilters();
            "
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item class="mt-4">
        <v-btn color="primary" block @click="applyFilters"> Aplicar Filtros </v-btn>
      </v-list-item>
      <v-list-item class="mt-2">
        <v-btn color="grey-darken-2" block @click="clearAllFilters"> Limpar Filtros </v-btn>
      </v-list-item>

      <v-divider class="my-4"></v-divider>

      <v-list-item title="Dashboard" link>
        <template v-slot:prepend>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="mdi-view-dashboard"></v-icon>
            </template>
            Dashboard
          </v-tooltip>
        </template>
      </v-list-item>
      <v-list-item title="Usuários" link>
        <template v-slot:prepend>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="mdi-account"></v-icon>
            </template>
            Usuários
          </v-tooltip>
        </template>
      </v-list-item>
      <v-list-item title="Veículos" link>
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
        <v-menu activator="parent" location="end">
          <v-list density="compact" nav class="bg-deep-purple">
            <v-list-item
              title="Serviço 24h"
              value="report24"
              @click="openDialog('Serviço 24h')"
            />
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
      <v-btn variant="text" class="text-none"></v-btn>
    </template>

    <template v-slot:extension>
      <v-col>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab prepend-icon="mdi-car" value="carro">Veículos</v-tab>
          <v-tab prepend-icon="mdi-walk" value="pedestre">Pedestres</v-tab>
        </v-tabs>
      </v-col>
    </template>
  </v-app-bar>
  <v-layout>
    <v-main>
      <v-card>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="carro">
              <router-view
                @update-btn="updateBtn"
                @changeTable="changeTable"
                :tab="tab"
                :filters="filters"
                ref="tableCarro"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="pedestre" class="mx-auto my-auto">
              <router-view
                @update-btn="updateBtn"
                @changeTable="changeTable"
                :tab="tab"
                :filters="filters"
                ref="tablePedestre"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>

  <v-dialog v-model="dialog" max-width="720" :services="services">
    <v-card max-width="720" prepend-icon="mdi-update" :title="titleDialog">
      <v-card-text>
        <v-list>
          <v-list-item v-for="(item, index) in services.dados" :key="index">
            <v-row align="center">
              <v-col>RG: {{ item.rg }}</v-col>
              <v-col>Início: {{ item.dataInicio }}</v-col>
              <v-col>Hora: {{ item.horaInicio }}</v-col>
              <v-col>Término: {{ item.dataTermino ? item.dataTermino : 'Aberto' }}</v-col>
              <v-col><v-btn @click="listarServico(item)">Detalhes</v-btn></v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { dateFormatterOutput } from '@/js/maxMin';
import { VTimePicker } from 'vuetify/labs/VTimePicker'; // Importar VTimePicker

export default {
  components: {
    VTimePicker, // Registrar VTimePicker
  },
  provide() {
    return {
      dataTable: this.dataTable,
      tab: this.tab,
      setFalseDataTable: this.setFalseDataTable,
    };
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
    // --- PROPRIEDADES PARA FILTROS (MOVIDAS PARA CÁ) ---
    filters: {
      placa: null,
      documento: null,
      modelo: null,
      condutor: null, // Campo unificado para condutor/nome
      dataEntradaInicio: null,
      dataEntradaFim: null,
      dataSaidaInicio: null,
      dataSaidaFim: null,
      horaEntradaInicio: null, // V-time-picker retorna string HH:MM
      horaEntradaFim: null,
      horaSaidaInicio: null,
      horaSaidaFim: null,
    },
    menuEntradaData: false,
    menuEntradaDataFim: false,
    menuSaidaData: false,
    menuSaidaDataFim: false,
    menuEntradaHora: false,
    menuEntradaHoraFim: false,
    menuSaidaHora: false,
    menuSaidaHoraFim: false,
    // ------------------------------------
  }),
  methods: {
    async updateBtn(info) {
      if (info && info.from.name == 'Table') {
        this.dataTable = true;
        this.isLoggedin = true;
        this.drawer = false;
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
      this.$router.push({ name: 'Login' });
    },
    // --- MÉTODOS DE FILTRO (MOVIDOS PARA CÁ) ---
    clearFilter(filterName) {
      this.filters[filterName] = null;
      this.applyFilters();
    },
    clearAllFilters() {
      for (const key in this.filters) {
        this.filters[key] = null;
      }
      this.applyFilters();
    },
    applyFilters() {
      // Chamar o método loadItems do componente filho (TableCarros ou TablePedestres)
      // Usamos ref para acessar o componente filho
      console.log(this.tab);
      if (this.tab === 'carro' && this.$refs.tableCarro && this.$refs.tableCarro.$refs.baseTableRef) {
        this.$refs.tableCarro.$refs.baseTableRef.applyFiltersFromParent();
      } else if (this.tab === 'pedestre' && this.$refs.tablePedestre && this.$refs.tablePedestre.$refs.baseTableRef) {
        this.$refs.tablePedestre.$refs.baseTableRef.applyFiltersFromParent();
      }
    },
    // --- FIM MÉTODOS DE FILTRO ---
  },
};
</script>