// src/modules/shared/components/Cadastro.vue
<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center ga-3">
      <v-row>
        <v-col cols="3">
          <v-text-field v-model="ident" label="Placa|RG|CPF|Prefixo" :prepend-inner-icon="identValid ? iconIdent : ''"
            variant="outlined" density="compact" clearable autofocus :loading="loading" :error-messages="erroIdent"
            @click:clear="limparIdent" @keyup.enter.prevent="enviarIdent" @blur.prevent="enviarIdent" />
        </v-col>
        <v-spacer />
        <v-col cols="3" class="d-flex justify-end">
          <v-btn :color="isSaida ? 'warning' : 'primary'" :prepend-icon="isSaida ? 'mdi-logout' : 'mdi-login'"
            :disabled="!isFormValid" size="large" @click="salvar">
            {{ isSaida ? 'Registrar saída' : 'Registrar entrada' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <template v-if="isCadastroNovo">
        <formAcessoCadastro :placa-inicial="formData.placa" :documento-inicial="formData.documento"
          :marca="formData.marca" :modo="modoCadastro" :contexto="contexto" @sucesso="voltarParaAcesso"
          @cancelar="cancelarCadastro" />
      </template>
      <template v-else>
        <v-row v-if="identValid" align="center">
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
        <v-row v-if="isVeiculo" class="mt-2">

        </v-row>

        <v-row v-if="isErro" class="mt-2">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" density="compact">
              Ocorreu um erro ao processar fluxo
            </v-alert>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import formAcessoCadastro from '@/modules/acesso/presentation/components/formAcessoCadastro.vue'
import { useCadastroAcesso } from '@/modules/acesso/presentation/composables/useCadastroAcesso'
import { useCadastro } from '@/modules/shared/composables/useCadastro'

const emit = defineEmits(['update:options', 'changeTable'])

const tipo = ref('VEICULO')

const innerProps = reactive({ tipoForm: tipo, tipo })

const { state, ui, actions } = useCadastroAcesso(innerProps, emit)

const {
  formData,
  loading,
  isCadastroNovo,
  isFormValid,
  isSaida,
  contexto,
  isReadOnly
} = state

const { confirmText, destinosOptions, modoCadastro, isVeiculo } = ui

const {
  salvar,
  limparForm,
  buscarDados,
  onPlacaEnter,
  onDocEnter,
  cancelarCadastro,
  voltarParaAcesso
} = actions

const { ident, erroIdent, enviarIdent, limparIdent, identValid, novoTipo } = useCadastro({
  formData,
  buscarDados,
  onPlacaEnter,
  onDocEnter,
  limparForm,
})

const iconIdent = computed(() => {
  if (novoTipo.value.model === 'PLACA') return 'mdi-car'
  if (novoTipo.value.model === 'PREFIXO') return 'mdi-fire-truck'
  if (novoTipo.value.model === 'DOCUMENTO') return 'mdi-card-account-details'
})

const isErro = computed(() => state.machine?.status === 'erro')

watch(() => state.machine?.status, (status) => {
  if (status === 'idle') {
    limparIdent()
  }
})

watch(novoTipo, (t) => {
  if (t?.tipo) tipo.value = t.tipo
})
</script>