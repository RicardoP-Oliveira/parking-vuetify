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
              ref="rico"
              label="Identificador/Placa"
              variant="outlined"
              :rules="pRules"
              clearable
              :maxlength="getLength()"
              @click:clear="ident=''"
              @keyup="upper"
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
   
    <infoModal :dialog="{isDialog, idPlaca}" @fecha="closeModal" v-if="isDialog"/> 
  
  </v-responsive>
  </v-app>
</template>

<script>
 import {ref} from 'vue'
 import { jwtDecode } from 'jwt-decode'

   
  export default {
    props: {
      tab: String,
    },
    emits: ['updateBtn'],
    inject: ['dataTable'],
    name: 'Table',
    data: () => ({
      pRules: [
        value => {
          const pattern = /^([0-9]{2,4}$|^[A-Z0-9]{2,4}-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$)/
          if (value.length > 0) {
            return pattern.test(value) || 'Identificador inválido'
          } else {
            return true
          }
        }
      ],
      token: `Bearer ${localStorage.getItem('token')}` ,
      ident: '',
      isDialog: false,
      idPlaca: '',
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
          { title: 'Hora', key: 'hEntrada', align: 'center' }
        ] },
        { title: 'Documento', key: 'eRg', align: 'center' },
        { title: 'Condutor', key: 'eCondutor', align: 'center', width: '200px' },
        { title: 'Saída', align: 'center', children: [
          { title: 'Data', key: 'saida', align: 'center' },
          { title: 'Hora', key: 'hSaida', align: 'center' }
        ] },
        { title: 'Documento', key: 'sRg', align: 'center'},
        { title: 'Condutor', key: 'sCondutor', align: 'center', width: '200px'  },
        { title: 'Destino', key: 'destino', align: 'center', width: '80px'},
      ],
      serverItems: [],
      loading: true,
      totalItems: 0,
    }),
    methods: {
      async loadItems({ page, itemsPerPage }) {
        try {
          const res = await this.$ceicsservice.getTodos(page, itemsPerPage, this.token, this.tab);
          if (this.token) {
            try {
              const decoded = jwtDecode(this.token);
              if (decoded.isLoggedin && !this.dataTable) {
                this.$emit('updateBtn', { from: this.$options });
              }
            } catch (error) {
              console.error('Token inválido ou expirado: ', error);
            }
          }

          // Processa os resultados da API
          this.serverItems = res[0].dados;
          this.totalItems = res[1];

          
            this.$refs.rico?.focus();
          
        } catch (error) {
          console.error('Erro ao carregar itens do servidor:', error);
          // Tratar o erro adequadamente (ex.: exibir mensagem de erro)
        }
      },
      selectModal(){
        if (this.$refs.rico.isValid) {
          if (this.ident.length > 0 ){
            this.idPlaca = this.ident; 
            this.isDialog = true;
          }
        } 
      },
      async closeModal() {
        // Fecha o modal e redefine o identificador
        this.isDialog = false;
        this.ident = '';

        try {
          // Aguarda o carregamento dos itens
          await this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
        } catch (error) {
          console.error('Erro ao recarregar os itens após fechar o modal:', error);
          // Tratar o erro se o carregamento falhar
        }
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
    },
    computed: {
      upper() {
        if(this.ident) {
          this.ident = this.ident.toUpperCase()
        }
      }
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