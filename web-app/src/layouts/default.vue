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
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="bg-greey-light" flat height="75" elevation="2">
    <v-app-bar-nav-icon
      icon="mdi-dots-vertical"
      @click="drawer = !drawer"
      elevation="1"
      size="small"
      class="mr-3 ms-3"
    />

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
              <!-- Router-view que renderiza TableCarros.vue -->
              <router-view
                v-slot="{ Component }"
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
                @update-btn="updateBtn"
                @changeTable="changeTable"
                :tab="tab"
                :filters="filters"
                ref="tablePedestresWrapper"
              />
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
      let targetTab = this.tab;

      if (value && typeof value === 'object' && value.from) {
        if (value.from === 'infoModal') { 
          targetTab = 'carro';
        } else if (value.from === 'infoPedestre') { 
          targetTab = 'pedestre';
        }
      } else if (typeof value === 'string') {
        targetTab = value;
      }

      if (this.tab !== targetTab) {
        this.tab = targetTab; 
      } else {
        this.applyFilters(); 
      }
    },

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

    // Método que instrui a tabela ativa a recarregar os seus dados
    applyFilters() {

      this.$nextTick(() => {
        // this.$refs.tableCarrosWrapper.refreshTable();
    })

      // console.log(`[layout.vue] A aplicar filtros para a tab ativa: "${this.tab}".`, this.$parent);

      // // Acede à instância do TableBase através da sua wrapper (TableCarros/Pedestres)
      // // e depois à sua ref interna 'baseTableRef'.
      // if (this.tab === 'carro' && this.$refs.tableCarroWrapper && this.$refs.tableCarroWrapper.$refs.baseTableRef) {
      //   console.log('[layout.vue] A chamar applyFiltersFromParent para a tabela de Veículos.');
      //   this.$refs.tableCarroWrapper.$refs.baseTableRef.applyFiltersFromParent();
      // } else if (this.tab === 'pedestre' && this.$refs.tablePedestreWrapper && this.$refs.tablePedestreWrapper.$refs.baseTableRef) {
      //   console.log('[layout.vue] A chamar applyFiltersFromParent para a tabela de Pedestres.');
      //   this.$refs.tablePedestreWrapper.$refs.baseTableRef.applyFiltersFromParent();
      // } else {
      //   console.warn(`[layout.vue] Não foi possível encontrar a referência para a tabela ativa na tab: "${this.tab}".`);
      // }
    },
  },
  mounted() {
    this.applyFilters(); // Carrega os dados da tab inicial ao montar
  }
};
</script>