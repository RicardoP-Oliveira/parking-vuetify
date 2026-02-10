<template>
  
        <v-data-table-server
        :items-per-page="pageSize"
        density="compact"
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
            <v-col :cols="tab === 'carro' ? 2 : 3">
              <v-text-field
                v-model="ident"
                ref="identRef"
                autofocus
                label="Id|Placa|Documento|Prefixo"
                variant="outlined"
                :rules="[validateIdent]"
                clearable
                :maxlength="getLength()"
                @click:clear="clearIdent"
                @keyup="convertToUpper"
                @keypress.enter.prevent="selectModal()"
              ></v-text-field>
            </v-col>
            <v-col></v-col>
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
        :dialog="{ isDialog: modal.isOpen, idPlaca: ident }"
        @update:options="loadItems"
        @closeModal="closeModal"
      />
      <infoPedestre
        v-if="modal.isOpen && modal.type === 'pedestre'"
        :dialog="{ isDialog: modal.isOpen, idPlaca: ident }"
        @update:options="loadItems"
        @closeModal="closeModal"
      />

</template>

<script>
import infoPedestre from '@/components/modals/infoPedestre.vue';
import infoModal from '@/components/modals/infoModal.vue';
import { dateFormatterOutput } from '@/js/maxMin.js';

export default {
  components: {
    infoModal,
    infoPedestre,
  },
  props: {
    dataService: Function,
    tab: String,
    getHeaderOrder: Function,
    getColumns: Function,
    getHeaderGroups: Function,
    changeTable: Function,
    filters: Object, // Recebe o objeto filters de default.vue
  },
  emits: ['update-btn', 'changeTable', 'update:options', 'show-snackbar'],
  inject: ['dataTable'],
  name: 'Table',
  data() {
    return {
      valid: false,
      modal: {
        isOpen: false,
        type: null,
      },
      token: `Bearer ${localStorage.getItem('token')}`,
      ident: '',
      pageSize: 50,
      pageNow: 1,
      itemsPerPageOptions: [
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 200, title: '200' },
        { value: 500, title: '500' },
        { value: 1000, title: '1000' },
      ],
      serverItems: [],
      totalItems: 0,
      generatedHeaders: [],
      headerOrder: [],
      displayColuns: [],
      columnNameMap: {},
      headerGroups: {},
      columnsMap: {
      nome: { width: 450, align: 'center' },
      tipoDoc: { width: 130, align: 'center' },
      numDoc: { width: 160, align: 'center' },
      entrada: { width: 110 },
      hEntrada: { width: 90 },
      saida: { width: 110 },
      hSaida: { width: 90 },
      destino: {width: 110, align: 'center'}
    },
    };
  },
  created() {
    this.headerOrder = this.getHeaderOrder();
    this.displayColuns = this.getColumns();
    this.columnNameMap = this.setNamesMap();
    this.headerGroups = this.getHeaderGroups();
    this.loadItems();
  },
  methods: {
    // Novo método para ser chamado pelo pai para aplicar os filtros
    applyFiltersFromParent() {
      this.pageNow = 1;
      this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
    },

    async loadItems({ page = this.pageNow, itemsPerPage = this.pageSize } = {}) {
      const ORGAOS_PERMITIDOS = [
        'BM', 'PM', 'PC', 'EB', 'FAB', 'PRF', 'PF', 'MB', 'SEAP'
      ] 

      try {
        // Passa o objeto filters diretamente da prop
        const res = await this.dataService(
          page,
          itemsPerPage,
          this.token,
          this.tab,
          this.filters
        )
        this.serverItems = res[0].dados.map((item) => {

          const filteredItem = {}

          this.displayColuns.forEach((column) => {
            switch (column) {
              case 'tipoDoc':
                filteredItem.tipoDoc = item.docSigla ?? ''
                break
              
              case 'numDoc':
                filteredItem.numDoc = item.doc ?? ''
                break

              case 'nome':
                filteredItem.nome = [
                  item.graduaAbrev,
                  ORGAOS_PERMITIDOS.includes(item.orgaoSigla)
                    ? item.orgaoSigla
                    : null,
                  item.nGuerra
                ].filter(Boolean).join(' ')
                break

              case 'entrada':
                filteredItem.entrada = item.entrada
                ? dateFormatterOutput(item.entrada)
                : ''
                break

              case 'hEntrada':
                filteredItem.hEntrada = item.hEntrada ?? ''
                break
              
              case 'saida':
                filteredItem.saida = item.saida
                ? dateFormatterOutput(item.saida)
                : ''
                break

              case 'hSaida':
                filteredItem.hSaida = item.hSaida ?? ''
                break

              default:
                filteredItem[column] = item[column] ?? ''

            }
          })

          return filteredItem
        })
        
        this.totalItems = res[1];
        this.generateHeaders();

      } catch (error) {
        console.error('Erro ao carregar itens do servidor:', error);
      }
    },
    setNamesMap() {
      return {
        marcaModelo: 'Modelo',
        eRg: 'Documento',
        eCondutor: 'Condutor',
        sRg: 'Documento',
        sCondutor: 'Condutor',
        entrada: 'Data',
        saida: 'Data',
        hEntrada: 'Hora',
        hSaida: 'Hora',
        nome: 'Pedestre',
        tipoDoc: 'Tipo Documento',
        numDoc: 'Documento',
      };
    },

    generateHeaders() {
      const headers = []

      this.headerOrder.forEach((key) => {

        // 🔹 HEADER AGRUPADO
        if (this.headerGroups[key]) {
          const group = this.headerGroups[key]

          headers.push({
            title: group.title,
            align: 'center',
            children: group.children.map((child) => {
              const col = this.columnsMap?.[child.key] ?? {}

              return {
                key: child.key,
                title: this.columnNameMap[child.key] ?? child.title ?? child.key,
                align: col.align ?? 'center',
                width: col.width ?? 100
              }
            })
          })

          return
        }

        // 🔹 HEADER SIMPLES
        const col = this.columnsMap?.[key] ?? {}

        headers.push({
          key,
          title: this.columnNameMap[key] ?? key,
          align: col.align ?? 'center',
          width: col.width ?? 100
        })
      })

      this.generatedHeaders = headers
    },
    getWidth(value) {
      if (value === 'eCondutor' || value === 'sCondutor') {
        return '200px';
      } else if (value === 'name') {
        return '250px';
      }
      return value === 'eCondutor' || value === 'sCondutor' ? '200px' : '100px';
    },

    selectModal() {
      const ifPattern = /^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$/;
      if (this.ident !== '' || this.ident.length > 0) {
        this.modal.isOpen = true;
        this.modal.type = ifPattern.test(this.ident) ? 'carro' : 'pedestre';
      } else {
        this.$emit('show-snackbar', {
          message: 'Campo obrigatório.',
          color: 'error',
          timeout: 3000
        })
      }
    },
    clearIdent() {
      this.ident = '';
    },
    validateIdent(value) {
      const pattern = /^(?!0+\d?)([0-9]{1,11}$|^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$)/;
      return value.length === 0 || pattern.test(value) || 'Identificador inválido';
    },
    getLength() {
      const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;
      const vtrRegex = /^[A-Z]{1,4}\d?-\d{3}$/;
      const docRegex = /^\d{1,11}$/;

      if (placaRegex.test(this.ident)) {
        return 7;
      } else if (vtrRegex.test(this.ident)) {
        return this.ident.length; // Ou um valor máximo se houver
      } else if (docRegex.test(this.ident)) {
        return 11;
      } else {
        return 10; // Valor padrão para outros casos
      }
    },
    setFocus() {
      this.$nextTick(() => {
        setTimeout(() => {
        if (this.$refs.identRef) {
          this.$refs.identRef.focus();
        }
      }, 170);
      })
    },
    async closeModal(from) {
      this.modal.isOpen = false;
      this.clearIdent();
      this.$emit('changeTable', from)
      this.applyFiltersFromParent();
      this.ident = '';
      this.setFocus();
    },
    onUpdateOptions({ page, itemsPerPage }) {
      this.pageNow = page;
      this.pageSize = itemsPerPage;
      this.loadItems({ page, itemsPerPage });
      this.setFocus();
    },
  },
  computed: {
    convertToUpper() {
      this.ident = this.ident ? this.ident.toUpperCase() : '';
    },
  },
  watch: {
    tab(newTab) {
      this.$emit('update-btn')
      this.loadItems({ page: this.pageNow, itemsPerPage: this.pageSize });
      setTimeout(() => {
        this.setFocus();
      }, 300);
    },
    // Monitora a prop 'filters' para recarregar os dados quando os filtros mudarem no pai
    filters: {
      handler() {
        this.loadItems();
      },
      deep: true, // Importante para observar mudanças dentro do objeto filters
    },
  },
};
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

tbody tr:hover {
  color: #f07272;
}
.flex-table {
  height: 88vh;
}

.v-data-tabe table {
  table-layout: fixed;
}

.v-data-table tc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>