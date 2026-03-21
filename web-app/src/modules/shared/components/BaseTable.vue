<template>
  <div class="base-table-container">
    <v-data-table-server
    :items-per-page="pageSize"
    :page="pageNow"
    :headers="generatedHeaders"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    @update:options="onUpdateOptions"
    density="compact"
    hide-default-footer
    fixed-header
    :class="['flex-table',{
      'width-pedestre': tab !== 'carro'
       }
    ]"
    >
      <template v-slot:top>
        <v-row class="px-4 pt-4">
          <v-col :cols="tab === 'carro' ? 2 : 3">
            <v-text-field
              v-model="ident"
              ref="identRef"
              label="Placa|RG/CPF|Prefixo"
              variant="outlined"
              autofocus
              clearable
              :rules="[v => validarIdentidade(v).valido || validarIdentidade(v).msg]"
              :maxlength="getLength"
              @click:clear="clearIdent"
              @keypress.enter.prevent="selectModal"
            />
          </v-col>
          <v-col />
          <v-col>
            <v-data-table-footer
              :items-per-page-options="[50, 100, 200, 500]"
              show-current-page
              items-per-page-text="Resultado por página"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>

    <acessoModal
      v-if="modal.isOpen"
      :dialog="{
        isDialog: modal.isOpen,
        idPlaca: modal.idPlaca,
        documento: modal.documento,
      }"
      :tipoForm="modal.type"
      :tipo="modal.type"
      @closeModal="closeModal"
      @update:options="loadItems"
      @changeTable="changeTable"
    />
  </div>
  
</template>

<script setup>
import { useBaseTable } from '@/modules/shared/composables/useBaseTable'
import acessoModal from '@/modules/acesso/presentation/components/acessoModal.vue'

const props = defineProps({
  dataService: Function,
  tab: String,
  getHeaderOrder: Function,
  getColumns: Function,
  getHeaderGroups: Function,
  saveCarro: Function,
  savePedestre: Function,
  filters: Object
})

const changeTable = (tabDestino) => {
  emit('changeTable', tabDestino)
}
const emit = defineEmits([
  'update-btn',
  'changeTable',
  'show-snackbar',
  'abrirCadastroPessoa',
  'abrirCadastroCarro'
])

const {
  ident, identRef, loading, pageNow, pageSize, serverItems,
  totalItems, generatedHeaders, modal, validarIdentidade, getLength, 
  clearIdent, selectModal, closeModal, loadItems, onUpdateOptions
} = useBaseTable(props, emit)

</script>

<style scoped>
:deep(.v-data-table__tr:nth-of-type(odd)) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
:deep(.v-data-table__tr:hover) {
  color: #f07272;
  background-color: #f072721a !important;
}
.flex-table {
  height: 88vh;
}
.width-pedestre {
  width: 80%;
  max-width: 80%;
  margin: 0 auto;
}
</style>