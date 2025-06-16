<template>
  <v-app>
    <v-responsive>
      <v-data-table-server
        :items-per-page="pageSize"
        density="compact"
        height="600"
        fixed-header
        items-per-page-text="Resultado por página"
        :page="pageNow" 
        :headers="generatedHeaders"
        :items="serverItems"
        :items-length="totalItems"
        @update:options="onUpdateOptions"
        hide-default-footer
        item-name="placa"
        class="flex-table"
        hover
      >
      <template v-slot:top>
        <v-row class="px-4 pt-4">
          <v-col cols="2">
            <v-text-field
              v-model="ident"
              ref="ident"
              autofocus
              label="Identificador/Placa"
              variant="outlined"
              :rules="[validateIdent]"
              clearable
              :maxlength="getLength()"
              @click:clear="clearIdent"
              @keyup="convertToUpper"
              @keypress.enter.prevent="selectModal()"
            >
            </v-text-field>
          </v-col>
         
          <!-- inicio aplicação filtro   -->
          <v-col cols="2">
            <v-text-field
              v-model="filters.placa"
              label="Placa"
              variant="outlined"
              clearable
              @click:clear="clearFilter('placa')"
              @keyup.enter="applyFilters"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filters.documento"
              label="Documento"
              variant="outlined"
              clearable
              @click:clear="clearFilter('documento')"
              @keyup.enter="applyFilters"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filters.modelo"
              label="Modelo"
              variant="outlined"
              clearable
              @click:clear="clearFilter('modelo')"
              @keyup.enter="applyFilters"
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
              v-model="filters.condutor"
              :label="tab === 'carro' ? 'Condutor' : 'Nome'"
              variant="outlined"
              clearable
              @click:clear="clearFilter('condutor')"
              @keyup.enter="applyFilters"
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-menu
              v-model="menuEntradaData"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.dataEntradaInicio ? new Date(filters.dataEntradaInicio).toLocaleDateString('pt-BR') : ''"
                  label="Data Entrada Início"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('dataEntradaInicio')"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.dataEntradaInicio"
                show-adjacent-months
                @update:model-value="menuEntradaData = false; applyFilters()"
                :hide-header="true"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-menu
              v-model="menuEntradaDataFim"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.dataEntradaFim ? new Date(filters.dataEntradaFim).toLocaleDateString('pt-BR') : ''"
                  label="Data Entrada Fim"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('dataEntradaFim')"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.dataEntradaFim"
                show-adjacent-months
                @update:model-value="menuEntradaDataFim = false; applyFilters()"
                :hide-header="true"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="2">
            <v-menu
              v-model="menuSaidaData"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.dataSaidaInicio ? new Date(filters.dataSaidaInicio).toLocaleDateString('pt-BR') : ''"
                  label="Data Saída Início"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('dataSaidaInicio')"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.dataSaidaInicio"
                show-adjacent-months
                @update:model-value="menuSaidaData = false; applyFilters()"
                :hide-header="true"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-menu
              v-model="menuSaidaDataFim"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.dataSaidaFim ? new Date(filters.dataSaidaFim).toLocaleDateString('pt-BR') : ''"
                  label="Data Saída Fim"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('dataSaidaFim')"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.dataSaidaFim"
                show-adjacent-months
                @update:model-value="menuSaidaDataFim = false; applyFilters()"
                :hide-header="true"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="2">
            <v-menu
              v-model="menuEntradaHora"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.horaEntradaInicio"
                  label="Hora Entrada Início"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
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
          </v-col>
          <v-col cols="2">
            <v-menu
              v-model="menuEntradaHoraFim"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.horaEntradaFim"
                  label="Hora Entrada Fim"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('horaEntradaFim')"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="filters.horaEntradaFim"
                format="24hr"
                @update:model-value="menuEntradaHoraFim = false; applyFilters()"
                title="Selecione a hora"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-menu
              v-model="menuSaidaHora"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.horaSaidaInicio"
                  label="Hora Saída Início"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('horaSaidaInicio')"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="filters.horaSaidaInicio"
                format="24hr"
                @update:model-value="menuSaidaHora = false; applyFilters()"
                title="Selecione a hora"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-menu
              v-model="menuSaidaHoraFim"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :model-value="filters.horaSaidaFim"
                  label="Hora Saída Fim"
                  variant="outlined"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="clearFilter('horaSaidaFim')"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="filters.horaSaidaFim"
                format="24hr"
                @update:model-value="menuSaidaHoraFim = false; applyFilters()"
                title="Selecione a hora"
              ></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="auto">
            <v-btn
              color="primary"
              size="large"
              class="mt-2"
              @click="applyFilters"
            >
              Aplicar Filtros
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="grey-darken-2"
              size="large"
              class="mt-2"
              @click="clearAllFilters"
            >
              Limpar Filtros
            </v-btn>
          </v-col>

          <!-- Fim filtro -->

          <v-col>
            <v-data-table-footer
              :items-per-page-options="itemsPerPageOptions"
              items-per-page-text="Resultado por página"
            />
          </v-col>
        </v-row>  
      </template>
      </v-data-table-server>
    <infoModal
      v-if="modal.isOpen && modal.type === 'carro'"
      :dialog="{isDialog: modal.isOpen, idPlaca: modal.idPlaca}"
      @update:options="loadItems"
      @closeModal="closeModal"
    />
    <infoPedestre
      v-if="modal.isOpen && modal.type === 'pedestre'"
      :pedestre="modal.isOpen"
      @update:options="loadItems"
      @closeModal="closeModal"
    /> 
  </v-responsive>
  </v-app>
</template>

<script>
 import { ref } from 'vue'
 import { jwtDecode } from 'jwt-decode'
 import infoPedestre from '@/components/modals/infoPedestre.vue';
 import infoModal from '@/components/modals/infoModal.vue';
 import { dateFormatterOutput } from '@/js/maxMin.js';
 import { VTimePicker } from 'vuetify/labs/VTimePicker';
   
  export default {
    components: {
      infoModal,
      infoPedestre,
      VTimePicker
    },
    props: {
      dataService: Function,
      tab: String,
      getHeaderOrder: Function,
      getColumns: Function,
      getHeaderGroups: Function,
      changeTable: Function,
    },
    emits: [
      'updateBtn',
      'changeTable',
      'update:options',
      'closeModal'
    ],
    inject: ['dataTable'],
    name: 'Table',
    data() {
      return {
        modal: {
          isOpen:false,
          idPlaca: '',
          type: null,
        },
        token: `Bearer ${localStorage.getItem('token')}` ,
        ident: '',
        pageSize: 50,
        pageNow: 1,
        itemsPerPageOptions: ref([
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: 200, title: '200' },
          { value: 500, title: '500' },
          { value: 1000, title: '1000'},
        ]),
        serverItems: [],
        totalItems: 0,
        generatedHeaders: [],
        headerOrder: this.getHeaderOrder(),
        displayColuns: this.getColumns(),
        columnNameMap: this.setNamesMap(),
        headerGroups: this.getHeaderGroups(),
        // --- NOVAS PROPRIEDADES PARA FILTROS ---
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
      }
    },
    methods: {
      // --- MÉTODOS DE FILTRO ---
    clearFilter(filterName) {
      this.filters[filterName] = null;
      // Para v-text-field com :model-value, pode ser necessário redefinir a string vazia se for uma data/hora formatada
      if (filterName.includes('data') || filterName.includes('hora')) {
        this.filters[filterName] = null; // Ou new Date(null) se Vuetify precisar
      }
      this.applyFilters();
    },
    clearAllFilters() {
      for (const key in this.filters) {
        this.filters[key] = null;
      }
      this.applyFilters();
    },
    applyFilters() {
      // Sempre recarregar os itens na primeira página ao aplicar filtros
      this.pageNow = 1; 
      this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
    },
    // --- FIM MÉTODOS DE FILTRO ---


      async loadItems({ page = this.pageNow , itemsPerPage = this.pageSize} = {}) {
        try {
          const res = await this.dataService(page, itemsPerPage, this.token, this.tab, this.filters);
          // this.validadeToken(this.token);
          this.serverItems = res[0].dados.map((item) => {
            let filteredItem = {};
            this.displayColuns.forEach((column) => {
              if (column === 'entrada' || column === 'saida') {
                filteredItem[column] = dateFormatterOutput(item[column]);
              } else {
                filteredItem[column] = item[column];
              }
            });
            return filteredItem;
          });
          this.totalItems = res[1];
          this.generateHeaders(); 
        } catch (error) {
          console.error('Erro ao carregar itens do servidor:', error);
        }
      },
      setNamesMap() {
        return ({
          marcaModelo: 'Modelo',
          eRg: 'Documento',
          eCondutor: 'Condutor',
          sRg: 'Documento',
          sCondutor:  'Condutor',
          entrada: 'Data',
          saida: 'Data',
          hEntrada: 'Hora',
          hSaida: 'Hora',
          name: 'Pedestre',
          tDoc: 'Tipo Documento',
          nDoc: 'Documento',
        }) 
      },
      generateHeaders() {
        const headers = [];
        this.headerOrder.forEach(headerKey => {
          if (this.headerGroups[headerKey]) {
            const group = this.headerGroups[headerKey];
            headers.push({
              title: group.title,
              align: 'center',
              children: group.children.map(child => ({
                  title: this.columnNameMap[child.key] || child.key.charAt(0).toUpperCase() + child.key.slice(1),
                  key: child.key,
                  align: 'center',
                }
              )),
            });
          } else {
            headers.push({
              title: this.columnNameMap[headerKey] || headerKey.charAt(0).toUpperCase() + headerKey.slice(1),
              key: headerKey,
              align: 'center',
              width: this.getWidth(headerKey),
            });
          }
        });
        this.generatedHeaders = headers;
      },
      getWidth(value) {
        if (value === 'eCondutor' || value === 'sCondutor') {
          return '200px';
        } else if (value === 'name') {
          return '250px'
        } 
        return value === 'eCondutor' || value === 'sCondutor' ? '200px' : '100px'
      },
    
      // validadeToken(token) {
      //   try {
      //     const decoded = jwtDecode(token);
      //     if (decoded.isLoggedin && !this.dataTable) {
      //       this.$emit('updateBtn', { from: this.$options });
      //     }
      //   } catch (error) {
      //     console.error('Token inválido ou expirado: ', error);
      //   }
      // },
      selectModal(){
        if (this.$refs.ident.isValid) {
          this.modal.isOpen = true;
          this.modal.type = this.ident.length > 0 ? 'carro' : 'pedestre';
          this.modal.idPlaca = this.ident.length > 0 ? this.ident : '';
        }
      },
      clearIdent() {
        this.ident = '';
      },
      validateIdent(value) {
       const pattern = /^([0-9]{1,4}$|^[A-Z0-9]{2,6}-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$)/
       return value.length === 0 || pattern.test(value) || 'Identificador inválido';
      },
      getLength() {
        const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/
        const vtrRegex = /^[A-Z]{1,4}\d?-\d{3}$/
        const identRegex = /^[0-9]{2,4}$/ 

        if (placaRegex.test(this.ident)) {
          return 7 
        } else if (vtrRegex.test(this.ident)) {
          return this.ident.length 
        } else if (identRegex.test(this.ident)) {
          return 4 
        } else {
          return 10
        }
      },
      setFocus() {
        setTimeout(() => {
          if (this.$refs.ident) {
            this.$refs.ident.focus()
          }
        }
        , 200);
      },
      closeModal(from) {
        this.$emit('closeModal')
        this.modal.isOpen = false;
        this.clearIdent();
        this.$emit('changeTable', from);
        this.setFocus(); 
      },
      onUpdateOptions({page, itemsPerPage}) {
        this.pageNow = page;
        this.pageSize = itemsPerPage;
        this.loadItems({ page, itemsPerPage });
        this.setFocus();
      }
    },
    computed: {
      convertToUpper() {
        this.ident ? this.ident = this.ident.toUpperCase() : '';
      }
    },
    watch: {
      tab(newTab) {
        this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
        setTimeout(() => {
          this.setFocus();
        }, 170);
      },        
    },
    mounted() {
      this.$emit('updateBtn');
      this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
    },
   
  }
</script>

<style>
tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }

 tbody tr:hover {
  color: #f07272;
 }

</style>