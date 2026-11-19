<!-- src/modules/shared/components/Cadastro.vue -->
<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center ga-3">
      <v-row>
        <v-col v-if="!isCadastroNovo" cols="3">
          <v-text-field ref="identField" v-model="ident" label="Placa|RG|CPF|Prefixo"
            :prepend-inner-icon="identValid ? iconIdent : ''" variant="outlined" density="compact" clearable autofocus
            :loading="loading" :error-messages="erroIdent" @click:clear="onCancelar" @keyup.enter.prevent="enviarIdent"
            @blur.prevent="enviarIdent" />
        </v-col>

        <v-spacer />

        <v-col v-if="!isCadastroNovo" cols="3" class="d-flex justify-end">
          <v-btn :color="isSaida ? 'warning' : 'primary'" :prepend-icon="isSaida ? 'mdi-logout' : 'mdi-login'"
            :disabled="!isFormValid" size="large" @click="salvar">
            {{ isSaida ? 'Registrar saída' : 'Registrar entrada' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <!-- Campos do cadastro novo, antes exibidos por formAcessoCadastro.vue -->
      <v-row v-if="isCadastroNovo" align="center">
        <CadastroVeiculoForm v-if="mostrarCadastroVeiculo" :veiculo="cadastroVeiculo" :pessoa="cadastroPedestre"
          :is-vtr="cadastroIsVtr" :documento="cadastroBuscaDoc" :nome="cadastroNome"
          :dono-encontrado="cadastroDonoEncontrado" :info="info" :orgaos-options="cadastroOrgaosOptions"
          :doc-options="cadastroDocOptions" :trato-options="cadastroTratoOptions"
          :unidades-options="cadastroUnidadesOptions" :hint-orgao="hintOrgao" @update:is-vtr="cadastroIsVtr = $event"
          @update:documento="cadastroBuscaDoc = $event" @update:nome="cadastroNome = $event"
          @buscar-dono="buscarDono" />

        <CadastroPedestreForm v-else :pessoa="cadastroPedestre" :documento="cadastroBuscaDoc" :nome="cadastroNome"
          :dono-encontrado="cadastroDonoEncontrado" :orgaos-options="cadastroOrgaosOptions"
          :doc-options="cadastroDocOptions" :trato-options="cadastroTratoOptions"
          :unidades-options="cadastroUnidadesOptions" @update:documento="cadastroBuscaDoc = $event"
          @update:nome="cadastroNome = $event" @buscar-dono="buscarDono" />

        <v-col cols="3">
          <v-autocomplete v-model="cadastroDestinoId" :items="cadastroDestinosOptions" label="Destino"
            variant="outlined" item-title="title" item-value="destino" density="compact" />
        </v-col>
      </v-row>

      <!-- Campos do fluxo normal de entrada/saída -->
      <v-row v-else-if="identValid" align="center">
        <template v-if="novoTipo.model === 'PLACA'">
          <v-col v-if="formData.prefixo" cols="2">
            <v-text-field v-model="formData.prefixo" label="Prefixo" prepend-inner-icon="mdi-fire-truck" readonly
              variant="outlined" density="compact" />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="formData.documento" label="Documento do condutor"
              prepend-inner-icon="mdi-card-account-details" variant="outlined" density="compact" :loading="loading"
              @keyup.enter.stop="onDocEnter" @blur.stop="onDocEnter" />
          </v-col>

          <v-col cols="4">
            <v-text-field v-model="formData.nome" label="Nome" prepend-inner-icon="mdi-account" readonly
              variant="outlined" density="compact" :placeholder="loading ? 'Buscando...' : '-'" />
          </v-col>
        </template>

        <template v-else-if="novoTipo.model === 'PREFIXO'">
          <v-col cols="2">
            <v-text-field v-model="formData.placa" label="Placa" prepend-inner-icon="mdi-car" readonly
              variant="outlined" density="compact" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="formData.documento" label="Documento do condutor"
              prepend-inner-icon="mdi-card-account-details" variant="outlined" density="compact" :loading="loading"
              @keyup.enter.stop="onDocEnter" @blur.stop="onDocEnter" />
          </v-col>

          <v-col cols="4">
            <v-text-field v-model="formData.nome" label="Nome" prepend-inner-icon="mdi-account" readonly
              variant="outlined" density="compact" :placeholder="loading ? 'Buscando...' : '-'" />
          </v-col>
        </template>

        <template v-else>
          <v-col cols="4">
            <v-text-field v-model="formData.nome" label="Nome" prepend-inner-icon="mdi-account" readonly
              variant="outlined" density="compact" :placeholder="loading ? 'Buscando...' : '-'" />
          </v-col>
        </template>

        <v-col v-if="!isSaida" :cols="isVeiculo ? 3 : 4">
          <v-select v-model="formData.destino" :items="destinosOptions" :readonly="isReadOnly" item-title="title"
            item-value="destino" label="Destino" prepend-inner-icon="mdi-map-marker" variant="outlined"
            density="compact" color="primary" />
        </v-col>
      </v-row>

      <v-row v-if="isErro" class="mt-2">
        <v-col cols="12">
          <v-alert type="error" variant="tonal" density="compact">
            Ocorreu um erro ao processar o fluxo.
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="isCadastroNovo">
      <v-spacer />
      <v-btn variant="text" @click="onCancelar">
        Cancelar
      </v-btn>
      <v-btn color="primary" :disabled="!cadastroPodeSalvar" :loading="cadastroLoading" @click="salvarCadastroNovo">
        Confirmar cadastro
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useCadastro } from '@/modules/shared/composables/useCadastro'
import { useCadastroAcesso } from '@/modules/acesso/presentation/composables/useCadastroAcesso'
import CadastroVeiculoForm from './CadastroVeiculoForm.vue'
import CadastroPedestreForm from './CadastroPedestreForm.vue'

const emit = defineEmits(['update:options', 'changeTable'])

const tipo = ref('VEICULO')
const identField = ref(null)
const innerProps = reactive({ tipoForm: tipo, tipo })

const { state, ui, actions } = useCadastroAcesso(innerProps, emit)

const {
  formData,
  loading,
  isCadastroNovo,
  isFormValid,
  isSaida,
  isReadOnly,
  isErro
} = state

const {
  isVeiculo,
  destinosOptions
} = ui

const {
  salvar,
  limparForm,
  buscarDados,
  onPlacaEnter,
  onDocEnter,
  voltarParaAcesso,
} = actions

const cadastro = state.cadastroGeral

const {
  veiculo: cadastroVeiculo,
  pedestre: cadastroPedestre,
  buscaDoc: cadastroBuscaDoc,
  nome: cadastroNome,
  destino_id: cadastroDestinoId,
  donoEncontrado: cadastroDonoEncontrado,
  loading: cadastroLoading,
  isVtr: cadastroIsVtr,
} = cadastro.state

const {
  orgaosOptions: cadastroOrgaosOptions,
  unidadesOptions: cadastroUnidadesOptions,
  tratoOptions: cadastroTratoOptions,
  docOptions: cadastroDocOptions,
  destinosOptions: cadastroDestinosOptions,
  podeSalvar: cadastroPodeSalvar,
} = cadastro.ui

const {
  salvar: salvarCadastroNovo,
  buscarDono,
} = cadastro.actions

const modoCadastro = ui.modoCadastro

const mostrarCadastroVeiculo = computed(() => {
  return Boolean(formData.placa) && modoCadastro.value !== 'condutor'
})

const isOrgaoDisabled = computed(() => {
  return Boolean(cadastroDonoEncontrado.value) ||
    !cadastroBuscaDoc.value ||
    cadastroBuscaDoc.value.length < 4
})

const hintOrgao = 'O órgão será vinculado à viatura.'

const info = computed(() => {
  const nomeEncontrado = cadastroDonoEncontrado.value?.nomeCompleto
  if (!nomeEncontrado) return null

  return {
    prefixo: cadastroIsVtr.value && cadastroVeiculo.value.orgao_id
      ? 'Condutor autorizado:'
      : 'Veículo vinculado a:',
    nome: nomeEncontrado,
  }
})

const {
  ident,
  erroIdent,
  enviarIdent,
  limparIdent,
  identValid,
  novoTipo,
  onCancelar,
} = useCadastro({
  formData,
  buscarDados,
  onPlacaEnter,
  onDocEnter,
  limparForm,
  machine: state.machine,
  cancelarCadastro: actions.cancelarCadastro,
  focarIdent: () => identField.value?.focus(),
})

const iconIdent = computed(() => {
  if (novoTipo.value.model === 'PLACA') return 'mdi-car'
  if (novoTipo.value.model === 'PREFIXO') return 'mdi-fire-truck'
  if (novoTipo.value.model === 'DOCUMENTO') return 'mdi-card-account-details'
  return ''
})

watch(novoTipo, (novo) => {
  if (novo?.tipo) tipo.value = novo.tipo
})

watch(
  [isCadastroNovo, () => novoTipo.value?.model, ident],
  ([novo, modelo, valorIdent]) => {
    if (!novo || !valorIdent) return

    const valor = String(valorIdent).trim().toUpperCase()

    if (modelo === 'DOCUMENTO' && !cadastroBuscaDoc.value) {
      cadastroBuscaDoc.value = valor
    }

    if (modelo === 'PLACA' && !cadastroVeiculo.value.placa) {
      cadastroVeiculo.value.placa = valor
    }

    if (modelo === 'PREFIXO' && !cadastroVeiculo.value.prefixo) {
      cadastroVeiculo.value.prefixo = valor
    }
  },
  { immediate: true }
)

</script>