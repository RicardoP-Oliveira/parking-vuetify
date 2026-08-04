<template>
  <v-card :loading="loading" elevation="0">
    <v-card-title class="text-h6 pb-0">
      {{ tituloCadastro }}
    </v-card-title>

    <v-card-text class="pt-4">
      <v-row dense>
        <template v-if="mostrarCadastroVeiculo">
          <v-col cols="3">
            <v-text-field
              v-model="veiculo.placa"
              @update:model-value="v => veiculo.placa = (v || '').toUpperCase()"
              label="Placa"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="veiculo.prefixo"
              @update:model-value="v => veiculo.prefixo = (v || '').toUpperCase()"
              label="Prefixo (Se viatura)"
              variant="outlined"
              density="compact"
            />  
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="veiculo.marca"
              @update:model-value="v => veiculo.marca = (v || '').toUpperCase()"
              label="Modelo (Opcional)"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="4" class="pt-0 mt-n1">
            <v-switch
              v-model="isVtr"
              color="primary"
              label="Viatura Oficial"
              class="mt-0"
            />
          </v-col>
          <v-col cols="6" v-if="isVtr">
            <v-autocomplete
            v-model="veiculo.orgao_id"
            :items="orgaosOptions"
            item-title="title"
            item-value="id"
            label="Órgão da viatura."
            variant="outlined"
            clearable
            :hint="hintOrgao"
            persistent-hint
            density="compact"
          />
          </v-col>
          <v-col cols="12">
            <v-alert 
            v-if="veiculo.orgao_id" 
            type="info" 
            variant="tonal" 
            >
              <v-icon start>mdi-car-estate</v-icon>
                <strong>Viatura Oficial</strong> pertencente ao órgão: 
                <strong>{{ orgaosOptions.find(o => o.id === veiculo.orgao_id)?.title }}</strong>
            </v-alert>
          </v-col>
          <v-divider class="my-2 w-100" />
        </template>
        
        <v-col cols="4" v-if="!donoEncontrado">
          <v-select 
            v-model="pedestre.tipo_doc_id"
            :items="docOptions"
            item-title="title"
            item-value="id"
            label="Tipo Doc" 
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="pedestre.orgao_id"
            :items="orgaosOptions"
            item-title="title"
            item-value="id"
            label="Órgão Emissor"
            variant="outlined"
            clearable
            :disabled="isOrgaoDisabled"
            
            persistent-hint
            density="compact"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="buscaDoc"
            @input="buscaDoc = buscaDoc.replace(/\D/g, '')"
            @keyup.enter="buscarDono"
            @blur="buscarDono"
            autofocus
            :label="mostrarCadastroVeiculo ? 'Documento do Condutor' : 'Documento'"
            variant="outlined"
            clearable
            density="compact"
          />
        </v-col>

        <v-col cols="12">
          <v-fade-transition mode="out-in">
            <div
              v-if="donoEncontrado && buscaDoc?.length"
              key="dono"
            >
              <v-alert
                v-if="info && mostrarCadastroVeiculo" 
                type="success"
                variant="tonal"
                icon="mdi-account-check"
                density="compact"
              >
              {{ info.prefixo }} <strong>{{ info.nome }}</strong>
              </v-alert>
            </div>

            <div v-else-if="buscaDoc && buscaDoc.length > 3" key="avulso">
              <v-row dense>
                <v-col cols="3">
                  <v-select
                    v-model="pedestre.tratamento_id"
                    :items="tratoOptions"
                    item-title="title"
                    item-value="id"
                    label="Trato"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="9">
                  <v-text-field
                    v-model="nome"
                    @update:model-value="v => nome = (v || '').toUpperCase()"
                    label="Nome Completo"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete 
                    v-model="pedestre.unidade_id" 
                    :items="unidadesOptions" 
                    label="Unidade" 
                    variant="outlined" 
                    item-title="title"
                    item-value="id"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </div>
          </v-fade-transition>
        </v-col>

        <v-col cols="6">


        </v-col>
        <v-col cols="6">
          <v-autocomplete 
            v-model="destino_id" 
            :items="destinosOptions" 
            label="Destino" 
            variant="outlined" 
            item-title="title"
            item-value="id"
            density="compact"
          />
        </v-col>
    
      </v-row>  
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="$emit('cancelar', { fecharTudo: true })">Cancelar</v-btn>
      <v-btn color="primary" :disabled="!podeSalvar" @click="salvar">Confirmar Cadastro</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, watch} from 'vue'
import { useCadastroGeral } from '@/modules/cadastro/presentation/composables/useCadastroGeral'

const props = defineProps({
  placaInicial: String,
  documentoInicial: String,
  marca: String,
  contexto: Object,
  modo: String
})

const emit = defineEmits(['sucesso', 'cancelar'])

const { state, ui, actions } = useCadastroGeral(props, emit)

const {
  veiculo,
  pedestre,
  buscaDoc,
  nome,
  destino_id,
  donoEncontrado,
  loading,
  isVtr
} = state

const {
  orgaosOptions,
  unidadesOptions,
  tratoOptions,
  docOptions,
  destinosOptions,
  podeSalvar
} = ui 

const { salvar, buscarDono } = actions

const modoEfetivo = computed(() => {

  if (props.placaInicial) {
    return 'parcial'
  } else if (props.documentoInicial) {
    return 'completo'
  } else {
    return props.modo
  }
  // return props.modo || (props.placaInicial ? 'parcial' : 'completo')
})

const mostrarCadastroVeiculo = computed(() => {
  return !!props.placaInicial && modoEfetivo.value !== 'condutor'
})

const tituloCadastro = computed(() => {
  return mostrarCadastroVeiculo.value
    ? 'Cadastro de Veículo'
    : 'Cadastro de Pedestre/Condutor'
})

const isOrgaoDisabled = computed(() => {
  return !!donoEncontrado.value || !buscaDoc.value || buscaDoc.value.length < 4
})

const hintOrgao = computed(() => {
  return 'O órgao será vinculado à viatura.'
})

const info = computed(() => {
  const nome = donoEncontrado.value?.nomeCompleto

  if (!nome) return null

  return {
    prefixo: isVtr.value && veiculo.value.orgao_id
    ? 'Condutor autorizado:'
    : 'Veículo vinculado a:',
    nome
  } 
})

watch(isVtr, () => {
  if (!isVtr.value) {
   return  veiculo.value.orgao_id = null
  }
  return veiculo.value.orgao_id = 1
})

</script>