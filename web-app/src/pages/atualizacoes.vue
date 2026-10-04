<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h5 mb-2">Atualizações</h1>
        <p class="text-body-1 text-medium-emphasis">
          Execute e acompanhe a atualização de dados entre os bancos.
        </p>
      </v-col>

      <v-col cols="12" md="8" lg="6">
        <v-card class="card-rolavel">
          <v-card-title>Sincronização de dados</v-card-title>

          <v-card-text>
            <p>Inicie a transferência dos registros do banco de origem
              para o banco de destino.</p>

            <v-file-input v-model="arquivos" label="Selecione file_dgp.csv e dicionario.csv" accept=".csv, text/csv"
              multiple chips show-size prepend-icon="mdi-file" clear-icon />

          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" prepend-icon="mdi-update" :loading="enviando" :disabled="enviando"
              @click="iniciarAtualizacao">
              Iniciar atualização
            </v-btn>
          </v-card-actions>
          <v-card-text v-if="mensagem">
            {{ mensagem }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import AtualizacaoService from '@/core/services/AtualizacaoService'

const arquivos = ref([])
const enviando = ref(false)
const mensagem = ref('')

async function iniciarAtualizacao() {
  enviando.value = true
  mensagem.value = ''

  try {
    const resultado = await AtualizacaoService.importar(arquivos.value)
    console.log(resultado)
    mensagem.value = resultado.message ?? `Total de ${resultado.total} unidades inseridas.` //`Arquivos recebidos.`
  } catch (error) {
    mensagem.value = error.message
  } finally {
    enviando.value = false
  }
}
</script>

<style lang="css" scoped>
.card-rolavel {
  display: flex;
  flex-direction: column;
}

.card-rolavel>.v-card-text {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>