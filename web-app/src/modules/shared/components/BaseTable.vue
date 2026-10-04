// src/modules/shared/components/BaseTable.vue
<template>
  <div class="base-table-container">
    <Cadastro @change-table="handleChangeTable" />
    <v-card class="pt-2">
      <v-card-title>
        TESTE TÌTULO
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="generatedHeaders" :items="serverItems" :loading="loading" density="compact"
          hide-default-footer fixed-header :class="['flex-table', {
            'width-pedestre': tab !== 'VEICULO'
          }
          ]">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useBaseTable } from '@/modules/shared/composables/useBaseTable'
import Cadastro from './Cadastro.vue'

const props = defineProps({
  dataService: Function,
  tab: String,
  filters: Object
})

const emit = defineEmits(['changeTable'])

const { serverItems, loading, generatedHeaders, loadItems } = useBaseTable(props)

const handleChangeTable = (tipoSalvo) => {
  if (!tipoSalvo || tipoSalvo === props.tab) {
    loadItems()
    return
  } else {
    emit('changeTable', tipoSalvo)
  }
}

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