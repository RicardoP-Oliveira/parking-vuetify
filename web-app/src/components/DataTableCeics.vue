<template>
  <v-app>
    <v-responsive>
      <v-data-table-server
        :items-per-page="pageSize"
        density="compact"
        height="600"
        fixed-header
        last-page-label="Fim"
        items-per-page-text="Resultado por página"
        :page="pageNow" 
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        @update:options="loadItems"
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
   
    <!-- <infoModal :dialog="{isDialog, idPlaca}" @update:options="teste" @fecha="closeModal" v-if="isDialog"/> -->
    <infoModal
      v-if="modal.isOpen && modal.type === 'car'"
      :dialog="{isDialog: modal.isOpen, idPlaca: modal.idPlaca}"
      @update:options="loadItems"
      @closeModal="closeModal"
    />

    <!-- <infoPedestre :pedestre="isPedestre" @update:options="loadItems" @fecha="closeModal" v-if="isPedestre"/> -->
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
 import {ref} from 'vue'
 import { jwtDecode } from 'jwt-decode'
 import infoPedestre from '@/components/modals/infoPedestre.vue';
 import infoModal from '@/components/modals/infoModal.vue';

   
  export default {
    components: {
      infoModal,
      infoPedestre
    },
    props: {
      tab: String,
    },
    emits: [
      'updateBtn',
      'changeTable',
      'update:options'
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
        pageSize: ref(50),
        pageNow: ref(1),
        itemsPerPageOptions: ref([
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: 200, title: '200' },
          { value: 500, title: '500' },
          { value: 1000, title: '1000'},
        ]),
        headers: [
          {
            title: 'Placa',
            align: 'center',
            sortable: false,
            key: 'placa',
          },
          { title: 'Modelo', key: 'marcaModelo', align: 'center', width: '80px'},
          { title: 'Entrada', align: 'center', children: [
            { title: 'Data', key: 'entrada', align: 'center' },
            { title: 'Hora', key: 'hEntrada', align: 'center' },
            { title: 'Documento', key: 'eRg', align: 'center' },
            { title: 'Condutor', key: 'eCondutor', align: 'center', width: '200px' },
          ] },
          { title: 'Destino', key: 'destino', align: 'center'},
          { title: 'Saída', align: 'center', children: [
            { title: 'Data', key: 'saida', align: 'center' },
            { title: 'Hora', key: 'hSaida', align: 'center' },
            { title: 'Documento', key: 'sRg', align: 'center'},
            { title: 'Condutor', key: 'sCondutor', align: 'center', width: '200px'},
          ] },
        ],
        serverItems: [],
        totalItems: 0,
      }
    },
    methods: {
      async loadItems({ page = this.pageNow , itemsPerPage = this.pageSize } = {}) {
        try {
          const res = await this.$ceicsservice.getTodos(page, itemsPerPage, this.token, this.tab);
          this.validadeToken(this.token);
          this.serverItems = res[0].dados;
          this.totalItems = res[1];         
        } catch (error) {
          console.error('Erro ao carregar itens do servidor:', error);
        }
      },
      validadeToken(token) {
        try {
          const decoded = jwtDecode(this.token);
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
          this.modal.type = this.ident.length > 0 ? 'car' : 'pedestre';
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
        this.$nextTick(() => this.$refs.ident.focus());
      },
      // async teste(value) {
      //   const tab = value.from;
      //   if (tab.dialog.isDialog) {
      //     this.selModal = 'car';
   
      //   }
      //   await this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
      //   // this.$emit('changeTable', this.selModal); 
      // },
      closeModal() {
        this.modal.isOpen = false;
        this.clearIdent();
        this.setFocus();
        // this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
      },
    },
    computed: {
      convertToUpper() {
        this.ident ? this.ident = this.ident.toUpperCase() : '';
      }
    },
    mounted() {
      this.setFocus();
    }
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