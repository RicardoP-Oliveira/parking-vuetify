<template>
  <v-app>
    <FilterDrawer
      v-model="drawer"
      :tab="tab"
      :filters="filters"
      @clear-all="clearAllFilters"
      @gerar-pdf="gerarRelatorioPdf"
    />

    <v-app-bar color="white" flat elevation="2" density="compact">
      <template v-slot:extension>
        <v-app-bar-nav-icon
          icon="mdi-dots-vertical"
          @click="drawer = !drawer"
        />
        
        <v-tabs
          v-model="tab"
          fixed-tabs
          class="flex-grow-1"
        >
          <v-tab
            value="VEICULO"
            prepend-icon="mdi-car"
          >
            Veículos
          </v-tab>
          <v-tab
            value="PEDESTRE"
            prepend-icon="mdi-walk"
          >
            Pedestres
          </v-tab>
        </v-tabs>
        
        <v-btn
          v-if="hasActiveFilters"
          icon="mdi-printer"
          variant="text"
          @click="gerarRelatorioPdf"
        />
      </template>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component
            :is="Component" 
            :tab="tab"
            :key="tab"
            :filters="filters"
            @changeTable="changeTable" 
            @update-btn="updateBtn"
            @show-snackbar="handleShowSnackbar" 
          />
        </v-fade-transition>
      </router-view>
    </v-main>
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        location="center"
      >
        <div style="white-space: pre-line">{{ snackbar.message }}</div>

        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import FilterDrawer from '@/modules/shared/components/FilterDrawer.vue';
import { getAllFiltersSchema } from '@/core/config/filtersConfig';
import ConfigClass from '@/class/configClass';

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

const handleShowSnackbar = (options) => {
  // Atribui os valores vindos do emit ao estado reativo
  snackbar.value = {
    show: true,
    message: options.message || '',
    color: options.color || 'success',
    timeout: options.timeout || 3000
  }
}

const tab = ref('VEICULO');
const drawer = ref(false);
const dataTable = ref(false);
const filters = ref(getAllFiltersSchema());

provide('tab', computed(() => tab.value));
provide('dataTable', dataTable);

const hasActiveFilters = computed(() => Object.values(filters.value).some(v => v !== null && v !== ''));
const clearAllFilters = () => { filters.value = getAllFiltersSchema(); };
const updateBtn = (info) => { dataTable.value = info?.from?.name === 'Table'; };

const changeTable = (val) => {
  if (!val || val === 'cancel' || typeof val !== 'string') return
  tab.value = val
};

const gerarRelatorioPdf = async () => {
  const params =  new URLSearchParams()

  Object.entries(filters.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value)
    }
  })

  params.append('query', tab.value)

  const baseUrl = ConfigClass.getUrlApi().toString()
  const url = `${baseUrl}/ceics/relatorio/pdf?${params.toString()}`

  const res = await fetch(url)

  if (!res.ok) {
    const errorData = await res.json()
    handleShowSnackbar({
      message: errorData.message || 'Erro ao gerar relatório PDF.',
      color: 'error',
      timeout: 25000
    })
    return
  }
  window.open(url, '_blank')
}

</script>
