<script setup>
import { ref, computed, provide } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import FilterDrawer from '@/modules/shared/components/FilterDrawer.vue';
import { getAllFiltersSchema } from '@/core/config/filtersConfig';
import ConfigClass from '@/class/configClass';

const router = useRouter();
const { mobile } = useDisplay();

// ---------- SEU SCRIPT ORIGINAL (preservado integralmente) ----------
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

const handleShowSnackbar = (options) => {
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
  const params = new URLSearchParams()

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

// ---------- ADICIONADO (Etapa 2 — roupagem da foto) ----------
const navDrawer = ref(!mobile.value);         // sidebar fixa no desktop, drawer no mobile

// Usuário/dados de perfil (placeholder até a autenticação entrar na Etapa 5)
const usuario = JSON.parse(localStorage.getItem('usuario') ?? 'null') ?? {};
const nome = usuario?.nome ?? 'Operador';
const rotulo = usuario?.role?.nome ?? 'Sem perfil';
const nivel = usuario?.role?.nivel ?? 99;     // sem login ainda: enxerga todos os itens

// Menu lateral (padrão do seu exemplo)
const itensMenu = [
  { titulo: 'Controle', icone: 'mdi-shield-car', rota: 'controle', nivel: 1 },
  { titulo: 'Movimentações', icone: 'mdi-clipboard-list', rota: 'movimentacoes', nivel: 2 },
  { titulo: 'Serviço do Dia', icone: 'mdi-account-star', rota: 'servico', nivel: 1 },
  { titulo: 'Cadastros', icone: 'mdi-database-cog', rota: 'cadastros', nivel: 3 },
  { titulo: 'Relatórios', icone: 'mdi-chart-bar', rota: 'relatorios', nivel: 4 },
  { titulo: 'Usuários', icone: 'mdi-account-group', rota: 'usuarios', nivel: 5 },
].filter((item) => nivel >= item.nivel);

// Navega segura: rotas que ainda não existem mostram aviso em vez de 404
const navegar = (item) => {
  if (router.hasRoute(item.rota)) {
    router.push({ name: item.rota });
  } else {
    handleShowSnackbar({
      message: `Módulo "${item.titulo}" em construção.`,
      color: 'info',
      timeout: 2500
    });
  }
};

function sair() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push({ name: 'login' });
}
</script>

<template>
  <v-app>
    <!-- Drawer de FILTROS (seu FilterDrawer, papel de filtrar) -->
    <FilterDrawer
      v-model="drawer"
      :tab="tab"
      :filters="filters"
      @clear-all="clearAllFilters"
      @gerar-pdf="gerarRelatorioPdf"
    />

    <!-- App bar com identidade (cor da Etapa 1) -->
    <v-app-bar color="primary" flat elevation="1" density="comfortable">
      <v-app-bar-title>Controle de Estacionamento</v-app-bar-title>

      <v-spacer />

      <v-chip
        variant="flat"
        color="white"
        class="text-primary font-weight-medium mr-2"
        prepend-icon="mdi-account-circle"
      >
        {{ nome }}.{{ rotulo }}
      </v-chip>

      <v-btn
        icon="mdi-filter-variant"
        variant="text"
        @click="drawer = !drawer"
      >
        <v-badge v-if="hasActiveFilters" dot color="warning" floating />
      </v-btn>

      <v-btn
        v-if="hasActiveFilters"
        icon="mdi-printer"
        variant="text"
        @click="gerarRelatorioPdf"
      />

      <v-btn icon="mdi-logout" variant="text" @click="sair" />

      <!-- Tabs permanecem aqui nesta etapa (sem quebrar a troca Veículos/Pedestres).
           Na Etapa 3 elas migram para dentro do card, como na foto. -->
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          align-tabs="start"
          density="comfortable"
          class="flex-grow-1"
        >
          <v-tab value="VEICULO" prepend-icon="mdi-car">Veículos</v-tab>
          <v-tab value="PEDESTRE" prepend-icon="mdi-walk">Pedestres</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <!-- Drawer de NAVEGAÇÃO (esquerda, padrão da foto) -->
    <v-navigation-drawer
      v-model="navDrawer"
      :permanent="!mobile"
      width="240"
      elevation="1"
    >
      <v-list density="comfortable" nav>
        <v-list-item
          v-for="item in itensMenu"
          :key="item.rota"
          :prepend-icon="item.icone"
          :title="item.titulo"
          @click="navegar(item)"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
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
      </v-container>
    </v-main>

    <!-- Seu snackbar, preservado -->
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