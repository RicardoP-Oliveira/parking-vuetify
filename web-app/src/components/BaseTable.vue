<template>
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
    hover
    class="flex-table"
  >
    <template v-slot:top>
      <v-row class="px-4 pt-4">
        <v-col :cols="tab === 'carro' ? 2 : 3">
          <v-text-field
            v-model="ident"
            ref="identRef"
            label="Id|Placa|Documento|Prefixo"
            variant="outlined"
            autofocus
            clearable
            :rules="[validateIdent]"
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

  <infoModal
    v-if="modal.isOpen && modal.type === 'carro'"
    :dialog="{ isDialog: modal.isOpen, idPlaca: ident }"
    :tipo="modal.type"
    @update:options="loadItems"
    @closeModal="closeModal"
  />

  <infoPedestre
    v-if="modal.isOpen && modal.type === 'pedestre'"
    :dialog="{ isDialog: modal.isOpen, idPlaca: ident }"
    :tipo="modal.type"
    @update:options="loadItems"
    @closeModal="closeModal"
  />
</template>

<script setup>
import { useBaseTable } from '@/composables/useBaseTable'
import infoPedestre from '@/components/modals/infoPedestre.vue'
import infoModal from '@/components/modals/infoModal.vue'

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

const emit = defineEmits(['update-btn', 'changeTable', 'show-snackbar'])

const {
  ident, identRef, loading, pageNow, pageSize, serverItems,
  totalItems, generatedHeaders, modal, validateIdent, getLength, 
  clearIdent, selectModal, closeModal, loadItems, onUpdateOptions
} = useBaseTable(props, emit)

</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
tbody tr:hover {
  color: #f07272;
}
.flex-table {
  height: 88vh;
}
</style>