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
      <v-list-item>
        <v-text-field
          v-model="filters.placa"
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
          label="Documento"
          variant="outlined"
          clearable
          density="compact"
          @click:clear="clearFilter('documento')"
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
            "
            title="Selecione a hora"
          ></v-time-picker>
        </v-menu>
      </v-list-item>
      <!-- <v-list-item class="mt-4">
        <v-btn color="primary" block @click="applyFilters"> Aplicar Filtros </v-btn>
      </v-list-item> -->
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
      dataEntradaInicio: null,
      dataEntradaFim: null,
      dataSaidaInicio: null,
      dataSaidaFim: null,
      horaEntradaInicio: null,
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
  }),
 
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
  }
};
</script>

<style>

</style>