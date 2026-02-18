<template>
  <v-navigation-drawer v-model="drawer" class="bg-deep-purple">
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
      <v-list-item v-if="tab === 'carro'">
        <v-text-field
          v-model="filters.placa"
          @update:model-value="filters.placa = filters.placa?.toUpperCase()"
          label="Placa"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('placa')"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="filters.documento"
          @update:model-value="filters.documento = filters.documento?.toUpperCase()"
          label="Documento"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('documento')"
        ></v-text-field>
      </v-list-item>
      <v-list-item v-if="tab === 'carro'">
        <v-text-field
          v-model="filters.modelo"
          @update:model-value="filters.modelo = filters.modelo?.toUpperCase()"
          label="Modelo"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('modelo')"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="filters.condutor"
          @update:model-value="filters.condutor = filters.condutor?.toUpperCase()"
          :label="tab === 'carro' ? 'Condutor' : 'Nome'"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('condutor')"
        ></v-text-field>
      </v-list-item>

      <v-list-item>
        <v-menu v-model="menuEntradaData" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="
                filters.dataInicio
                  ? new Date(filters.dataInicio).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataInicio')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataInicio"
            show-adjacent-months
            @update:model-value="
              menuEntradaData = false;
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
                filters.dataFim
                  ? new Date(filters.dataFim).toLocaleDateString('pt-BR')
                  : ''
              "
              label="Data Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('dataFim')"
              :disabled="!filters.dataInicio"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dataFim"
            show-adjacent-months
            @update:model-value="
              menuEntradaDataFim = false;
            "
            :hide-header="true"
            :min="filters.dataInicio"
          ></v-date-picker>
        </v-menu>
      </v-list-item>

      <v-list-item>
        <v-menu v-model="menuEntradaHora" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaInicio"
              label="Hora Início"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaInicio')"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaInicio"
            format="24hr"
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item>
        <v-menu v-model="menuEntradaHoraFim" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters.horaFim"
              label="Hora Fim"
              variant="outlined"
              readonly
              v-bind="props"
              clearable
              density="compact"
              @click:clear="clearFilter('horaFim')"
              :disabled="!filters.horaInicio"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="filters.horaFim"
            format="24hr"
            @update:model-value="
              menuEntradaHoraFim = false;
            "
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <v-list-item class="mt-2">
        <v-btn color="grey-darken-2" block @click="clearAllFilters"> Limpar Filtros </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="bg-greey-light" flat height="15" elevation="2">
  
    <template v-slot:extension>
        <v-app-bar-nav-icon
      icon="mdi-dots-vertical"
      @click="drawer = !drawer"
      elevation="1"
      size="small"
      class="mr-3 ms-3"
      />
      <v-col>
        <!-- <v-tabs v-model="tab" fixed-tabs>
          <v-tab prepend-icon="mdi-car" value="carro">Veículos</v-tab>
          <v-tab prepend-icon="mdi-walk" value="pedestre">Pedestres</v-tab>
        </v-tabs> -->
        <div class="d-flex align-center">
          <v-tabs v-model="tab" fixed-tabs class="flex-grow-1">
            <v-tab prepend-icon="mdi-car" value="carro">Veículos</v-tab>
            <v-tab prepend-icon="mdi-walk" value="pedestre">Pedestres</v-tab>
          </v-tabs>
          <v-btn
            v-if="hasActiveFilters"
            icon="mdi-printer"
            size="large"
            variant="text"
            color="grey-darken-2"
            @click=""
            class="ml-4"
          ></v-btn>
        </div>
      </v-col>
    </template>
  </v-app-bar>
  <v-layout>
    <v-main>
      <v-card>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="carro">
              <!-- Router-view que renderiza TableCarros.vue -->
              <router-view
                v-slot="{ Component }"
                @show-snackbar="handleShowSnackbar"
              >
              <component
                :is="Component"
                @update-btn="updateBtn"
                @changeTable="changeTable"
                :tab="tab"
                :filters="filters"
                ref="tableCarrosWrapper"
              />
              </router-view>
            </v-tabs-window-item>
            <v-tabs-window-item value="pedestre" class="mx-auto my-auto">
              <!-- Router-view que renderiza TablePedestres.vue -->
              <router-view
                v-slot="{ Component }"
                @show-snackbar="handleShowSnackbar"
              >
                <component
                  :is="Component" 
                  @update-btn="updateBtn"
                  @changeTable="changeTable"
                  :tab="tab"
                  :filters="filters"
                  ref="tablePedestresWrapper"
                />
               </router-view>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script>
import { ref } from 'vue';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default {
  components: {
    VTimePicker,
  },
  provide() {
    return {
      dataTable: this.dataTable,
      tab: this.tab,
      setFalseDataTable: this.setFalseDataTable,
    };
  },
  emits: ['show-snackbar'],
  data: () => ({
    drawer: false,
    tab: 'carro', // Tab inicial
    focusRico: false,
    dataTable: ref(false),
    filters: {
      placa: null,
      documento: null,
      modelo: null,
      condutor: null,
      dataInicio: null,
      dataFim: null,
      //dataSaidaInicio: null,
      //dataSaidaFim: null,
      horaInicio: null,
      horaFim: null,
      //horaSaidaInicio: null,
      //horaSaidaFim: null,
    },
    menuEntradaData: false,
    menuEntradaDataFim: false,
    //menuSaidaData: false,
    //menuSaidaDataFim: false,
    menuEntradaHora: false,
    menuEntradaHoraFim: false,
    //menuSaidaHora: false,
    //menuSaidaHoraFim: false,
  }),

  computed: {
    hasActiveFilters() {
      for ( const key in this.filters) {
        const value = this.filters[key]
        if (value !== null && value !== undefined && value !== '') {
          return true
        }
      }
      return false
    }
  },
 
  methods: {
    handleShowSnackbar(options) {
      this.$emit('show-snackbar', options);
    },

    async updateBtn(info) {
      if (info && info.from && info.from.name == 'Table') {
        this.dataTable = true;
        this.drawer = false;
      } else {
        this.dataTable = false;
      }
    },

    setFalseDataTable() {
      this.dataTable = false;
    },

    changeTable(value) {

      if (typeof value === 'object' && value.from) {
        if (value.from === 'infoModal') { 
          this.tab = 'carro';
        } else if (value.from === 'infoPedestre') { 
          this.tab = 'pedestre';
        }
      } else if (typeof value === 'string') {
        this.tab = value;
      }
    },

    clearFilter(filterName) {
      this.filters[filterName] = null;
    },

    clearAllFilters() {
      for (const key in this.filters) {
        this.filters[key] = null;
      }
    },
  },
};
</script>

<style>

</style>