<template>
  <v-card :loading="loading" elevation="0">
    <v-card-title class="text-h6 pb-0">
      {{ placaInicial ? 'Cadastro de Veículo' : 'Cadastro de Pedestre' }}
    </v-card-title>

    <v-card-text class="pt-4">
      <v-row dense>
        <template v-if="placaInicial">
          <v-col cols="12" md="6">
            <v-text-field v-model="carro.placa" label="Placa" variant="outlined" readonly />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="carro.modelo"
              @update:model-value="v => carro.modelo = v.toUpperCase()"
              label="Modelo/Prefixo (Opcional)"
              readonly
              variant="outlined" />
          </v-col>
          <v-divider class="my-2 w-100" />
        </template>
        
        <v-col cols="4" md="4" v-if="!donoEncontrado">
          <v-select 
            v-model="pedestre.doc_id" 
            :items="docOptions"
            item-title="title"
            item-value="id"
            label="Tipo Doc" 
            variant="outlined" 
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="buscaDoc"
            autofocus
            :label="placaInicial ? 'Documento do Condutor' : 'Documento'"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            persistent-hint
          />
        </v-col>

        <v-col cols="12">
          <v-fade-transition mode="out-in">
            <div v-if="donoEncontrado" key="dono">
              <v-alert type="success" variant="tonal" icon="mdi-account-check" density="compact">
                Vinculado a: <strong>{{ donoEncontrado.nomeCompleto }}</strong>
              </v-alert>
            </div>

            <div v-else-if="buscaDoc && buscaDoc.length > 3" key="avulso">
              <v-row dense>
                <v-col cols="3">
                  <v-select v-model="pedestre.gradua_id" :items="tratoOptions" item-title="title" item-value="id" label="Trato" variant="underlined" />
                </v-col>
                <v-col cols="9">
                  <v-text-field v-model="nome" label="Nome Completo" variant="underlined" />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete 
                    v-model="pedestre.unidade_id" 
                    :items="unidadesOptions" 
                    label="Unidade" 
                    variant="underlined" 
                    item-title="title"
                    item-value="id"
                  />
                </v-col>
              </v-row>
            </div>
          </v-fade-transition>
        </v-col>

        <v-col cols="6">

          <v-autocomplete
            v-model="carro.orgao_id"
            :items="orgaosOptions"
            item-title="title"
            item-value="id"
            :label="(!buscaDoc || buscaDoc.length < 4) ? 'Órgão Proprietário do Veículo' : 'Órgão do Pedestre / Condutor'"
            variant="outlined"
            clearable
            :disabled="modo === 'condutor'"
            :hint="(!buscaDoc || buscaDoc.length < 4) ? 'Deixe o documento em branco para cadastrar como Veículo Oficial da frota.' : 'O órgão será vinculado ao perfil do visitante.'"
            persistent-hint
          />
        </v-col>
        <v-col cols="6">
          <v-autocomplete 
            v-model="destino_id" 
            :items="destinosOptions" 
            label="Destino" 
            variant="underlined" 
            item-title="title"
            item-value="id"
          />
        </v-col>
      </v-row>
      <v-expand-transition>
            <v-alert 
              v-if="carro.orgao_id" 
              type="info" 
              variant="tonal" 
              class="mb-3"
            >
              <template v-if="!buscaDoc || buscaDoc.length < 4">
                <v-icon start>mdi-car-estate</v-icon>
                <strong>Veículo Oficial</strong> pertencente ao órgão: <br>
                {{ orgaosOptions.find(o => o.id === carro.orgao_id)?.title }}
              </template>

              <template v-else>
                <v-icon start>mdi-account-hard-hat</v-icon>
                Veículo Particular. <br>
                <strong>Pedestre (Visitante)</strong> vinculado ao órgão: {{ orgaosOptions.find(o => o.id === carro.orgao_id)?.title }}
              </template>
            </v-alert>
          </v-expand-transition>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="$emit('cancelar', { fecharTudo: true })">Cancelar</v-btn>
      <v-btn color="primary" :disabled="!podeSalvar" @click="salvar">Confirmar Cadastro</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useCadastroGeral } from '@/modules/cadastro/presentation/composables/useCadastroGeral'

const props = defineProps({
  placaInicial: String,
  documentoInicial: String,
  modo: String
})

const emit = defineEmits(['sucesso', 'cancelar'])

const {
  carro, buscaDoc, donoEncontrado, nome, destino_id, orgaosOptions, unidadesOptions,
  loading, podeSalvar, salvar, docOptions, tratoOptions, destinosOptions, pedestre,
} = useCadastroGeral(props, emit)

const modo = computed(() => {
  if (props.placaInicial && carro.orgao_id) return 'condutor'
  if (props.placaInicial) return 'parcial'
  return 'completo'
})
</script>