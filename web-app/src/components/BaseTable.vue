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
   
  export default {
    components: {
      infoModal,
      infoPedestre
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
      }
    },
    methods: {
      async loadItems({ page = this.pageNow , itemsPerPage = this.pageSize} = {}) {
        try {
          const res = await this.dataService(page, itemsPerPage, this.token, this.tab);
          this.validadeToken(this.token);
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
      // dateFormatterOutput(data) {
      //     if (data) {
      //       const ndata = data.split('-');
      //       return (`${ndata[2]}/${ndata[1]}/${ndata[0]}`);
      //     }
      // },
      validadeToken(token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.isLoggedin && !this.dataTable) {
            this.$emit('updateBtn', { from: this.$options });
          }
        } catch (error) {
          console.error('Token inválido ou expirado: ', error);
        }
      },
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
       const pattern = /^([0-9]{2,4}$|^[A-Z0-9]{2,4}-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$)/
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