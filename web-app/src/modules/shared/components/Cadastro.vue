<!-- src/modules/shared/components/Cadastro.vue -->
<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center ga-3">
      <v-row>
        <v-col cols="3">
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
        <template v-if="mostrarCadastroVeiculo">
          <v-col cols="3">
            <v-text-field v-model="cadastroVeiculo.placa" label="Placa" variant="outlined" density="compact"
              @update:model-value="v => cadastroVeiculo.placa = (v || '').toUpperCase()" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="cadastroVeiculo.prefixo" label="Prefixo (se viatura)" variant="outlined"
              density="compact" @update:model-value="v => cadastroVeiculo.prefixo = (v || '').toUpperCase()" />
          </v-col>

          <v-col cols="6">
            <v-text-field v-model="cadastroVeiculo.marca" label="Modelo (opcional)" variant="outlined" density="compact"
              @update:model-value="v => cadastroVeiculo.marca = (v || '').toUpperCase()" />
          </v-col>

          <v-col cols="4" class="pt-0 mt-n1">
            <v-switch v-model="cadastroIsVtr" color="primary" label="Viatura Oficial" class="mt-0" />
          </v-col>

          <v-col v-if="cadastroIsVtr" cols="6">
            <v-autocomplete v-model="cadastroVeiculo.orgao_id" :items="cadastroOrgaosOptions" item-title="title"
              item-value="id" label="Órgão da viatura" variant="outlined" clearable :hint="hintOrgao" persistent-hint
              density="compact" />
          </v-col>

          <v-col v-if="cadastroVeiculo.orgao_id" cols="12">
            <v-alert type="info" variant="tonal">
              <v-icon start>mdi-car-estate</v-icon>
              <strong>Viatura Oficial</strong> pertencente ao órgão:
              <strong>
                {{cadastroOrgaosOptions.find(o => o.id === cadastroVeiculo.orgao_id)?.title}}
              </strong>
            </v-alert>
          </v-col>

          <v-col cols="12">
            <v-divider class="my-2" />
          </v-col>
        </template>

        <v-col v-if="!cadastroDonoEncontrado" cols="4">
          <v-select v-model="cadastroPedestre.tipo_doc_id" :items="cadastroDocOptions" item-title="title"
            item-value="id" label="Tipo de documento" variant="outlined" density="compact" />
        </v-col>

        <v-col cols="4">
          <v-autocomplete v-model="cadastroPedestre.orgao_id" :items="cadastroOrgaosOptions" item-title="title"
            item-value="id" label="Órgão emissor" variant="outlined" clearable :disabled="isOrgaoDisabled"
            persistent-hint density="compact" />
        </v-col>

        <v-col cols="4">
          <v-text-field v-model="cadastroBuscaDoc"
            :label="mostrarCadastroVeiculo ? 'Documento do condutor' : 'Documento'" variant="outlined" clearable
            density="compact" @input="cadastroBuscaDoc = cadastroBuscaDoc.replace(/\D/g, '')" @keyup.enter="buscarDono"
            @blur="buscarDono" />
        </v-col>

        <v-col cols="9">
          <v-text-field v-model="cadastroNome" label="Nome completo" variant="outlined" density="compact"
            @update:model-value="v => cadastroNome = (v || '').toUpperCase()" />
        </v-col>

        <v-col cols="12">
          <v-fade-transition mode="out-in">
            <div v-if="cadastroDonoEncontrado && cadastroBuscaDoc?.length" key="dono">
              <v-alert v-if="info && mostrarCadastroVeiculo" type="success" variant="tonal" icon="mdi-account-check"
                density="compact">
                {{ info.prefixo }} <strong>{{ info.nome }}</strong>
              </v-alert>
            </div>

            <div v-else-if="cadastroBuscaDoc && cadastroBuscaDoc.length > 3" key="avulso">
              <v-row>
                <v-col cols="3">
                  <v-select v-model="cadastroPedestre.tratamento_id" :items="cadastroTratoOptions" item-title="title"
                    item-value="id" label="Tratamento" variant="outlined" density="compact" />
                </v-col>

                <v-col cols="9">
                  <v-text-field v-model="cadastroNome" label="Nome completo" variant="outlined" density="compact"
                    @update:model-value="v => cadastroNome = (v || '').toUpperCase()" />
                </v-col>

                <v-col cols="12">
                  <v-autocomplete v-model="cadastroPedestre.unidade_id" :items="cadastroUnidadesOptions" label="Unidade"
                    variant="outlined" item-title="title" item-value="id" density="compact" />
                </v-col>
              </v-row>
            </div>
          </v-fade-transition>
        </v-col>

        <v-col cols="6">
          <v-autocomplete v-model="cadastroDestinoId" :items="cadastroDestinosOptions" label="Destino"
            variant="outlined" item-title="title" item-value="id" density="compact" />
        </v-col>
      </v-row>

      <!-- Campos do fluxo normal de entrada/saída -->
      <v-row v-else-if="identValid" align="center">
        <template v-if="novoTipo.model === 'PLACA'">
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
</script>