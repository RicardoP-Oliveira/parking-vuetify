<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const operador = JSON.parse(localStorage.getItem('usuario') ?? 'null') ?? {}

const modo = ref<'ENTRADA' | 'SAIDA'>('ENTRADA')
const tipo = ref<'VEICULO' | 'PEDESTRE'>('VEICULO')

const placa = ref('')
const marca = ref('')
const modelo = ref('')
const documento = ref('')
const destinoId = ref<number | null>(null)
const textoBusca = ref('')

const erro = ref('')
const sucesso = ref('')

const confirmacao = ref(false)
const confirmacaoTitulo = ref('')
const confirmacaoMensagem = ref('')
const acaoConfirmada = ref<() => void>(() => {})

const saidaDialog = ref(false)
const condutorSaidaDoc = ref('')



function formatarData(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function limparFormulario() {
  placa.value = ''
  marca.value = ''
  modelo.value = ''
  documento.value = ''
  destinoId.value = null
 
  erro.value = ''
  sucesso.value = ''
}

function buscarVeiculo() {
}

function buscarUsuario() {
}

function confirmarEntrada() {
  erro.value = ''
  sucesso.value = ''

  if (tipo.value === 'VEICULO') {
    if (!placa.value.trim()) {
      erro.value = 'Informe a placa do veículo'
      return
    }
    if (!documento.value.trim()) {
      erro.value = 'Informe o documento do condutor'
      return
    }
    // if (!usuarioEncontrado.value) {
    //   erro.value = 'Condutor não encontrado. Verifique o documento.'
    //   return
    // }
  } else {
    if (!documento.value.trim()) {
      erro.value = 'Informe o documento do pedestre'
      return
    }
    // if (!usuarioEncontrado.value) {
    //   erro.value = 'Pessoa não encontrada. Verifique o documento.'
    //   return
    // }
  }
  if (!destinoId.value) {
    erro.value = 'Selecione o destino'
    return
  }

  const identificacao = tipo.value === 'VEICULO' ? placa.value.trim().toUpperCase() : documento.value.trim().toUpperCase()
  confirmacaoTitulo.value = 'Confirmar registro de entrada'
  confirmacaoMensagem.value = `${tipo.value === 'VEICULO' ? 'Veículo' : 'Pedestre'} ${identificacao} entrando no quartel. Registros são imutáveis e não podem ser alterados após a gravação.`
  acaoConfirmada.value = gravarEntrada
  confirmacao.value = true
}

function gravarEntrada() {
  let veiculoId: number | undefined
  if (tipo.value === 'VEICULO') {
    // if (!veiculoEncontrado.value) {
    //   const novo = criarVeiculo({
    //     placa: placa.value,
    //     marca: marca.value || undefined,
    //     modelo: modelo.value || undefined,
    //     usuario_id: usuarioEncontrado.value?.id,
    //     orgao_id: usuarioEncontrado.value?.orgao_id,
    //   })
    //   veiculoId = novo.id
    // } else {
    //   veiculoId = veiculoEncontrado.value.id
    // }
  }

  // registrarEntrada({
  //   tipo: tipo.value,
  //   user_entrada_id: usuarioEncontrado.value!.id,
  //   veiculo_id: veiculoId,
  //   destino_id: destinoId.value!,
  //   registrado_por_id: operador?.id ?? 0,
  // })

  sucesso.value = `Entrada registrada: ${tipo.value === 'VEICULO' ? placa.value.trim().toUpperCase() : documento.value.trim().toUpperCase()}`
  limparFormulario()
  // recarregarMovimentacoes()
}

function buscarSaida() {
  erro.value = ''
  // resultadoSaida.value = buscarAbertaPorTexto(textoBusca.value)
  // if (resultadoSaida.value.length === 0) {
  //   erro.value = 'Nenhuma movimentação aberta encontrada para esse texto'
  // }
}

// function confirmarSaida(mov: MovimentacaoExibicao) {
//   erro.value = ''
//   saidaMov.value = mov
//   condutorSaidaDoc.value = mov.condutorDocumento ?? ''
//   condutorSaidaEncontrado.value = mov.condutorDocumento
//     ? buscarUsuarioPorDocumento(mov.condutorDocumento) ?? null
//     : null
//   saidaDialog.value = true
// }

// function buscarCondutorSaida() {
// }

// function executarSaida() {
//   const mov = saidaMov.value
//   if (!mov) return

//   let userSaidaId: number
//   if (mov.tipo === 'VEICULO') {
//     if (!condutorSaidaDoc.value.trim()) {
//       erro.value = 'Informe o documento do condutor na saída'
//       return
//     }
//     if (!condutorSaidaEncontrado.value) {
//       erro.value = 'Condutor não encontrado para o documento informado'
//       return
//     }
//     userSaidaId = condutorSaidaEncontrado.value.id
//   } else {
//     userSaidaId = mov.userEntradaId
//   }

  
// }

function executarConfirmacao() {
  acaoConfirmada.value()
  confirmacao.value = false
}

let intervalo: number | undefined




</script>
<template>
    <v-card class="mb-4">
          <v-card-title class="d-flex align-center ga-3" elevation="3">
            <v-btn-toggle v-model="modo" density="compact" mandatory>
              <v-btn value="ENTRADA">Entrada</v-btn>
              <v-btn value="SAIDA">Saída</v-btn>
            </v-btn-toggle>
            <v-btn-toggle v-if="modo === 'ENTRADA'" v-model="tipo" density="compact" mandatory>
              <v-btn value="VEICULO" prepend-icon="mdi-car">Veículo</v-btn>
              <v-btn value="PEDESTRE" prepend-icon="mdi-walk">Pedestre</v-btn>
            </v-btn-toggle>
          </v-card-title>

          <v-card-text>
            <template v-if="modo === 'ENTRADA'">
              <v-form @submit.prevent="confirmarEntrada">
                <div class="d-flex flex-wrap ga-3 align-start">
                  <template v-if="tipo === 'VEICULO'">
                    <v-text-field
                      v-model="placa"
                      label="Placa"
                      prepend-inner-icon="mdi-car"
                      density="compact"
                      class="flex-grow-1"
                      style="max-width: 220px"
                      @blur="buscarVeiculo"
                    />
                    <v-text-field
                      v-model="marca"
                      label="Marca"
                      density="compact"
                      class="flex-grow-1"
                      style="max-width: 180px"
                      :disabled="!!veiculoEncontrado"
                    />
                    <v-text-field
                      v-model="modelo"
                      label="Modelo"
                      density="compact"
                      class="flex-grow-1"
                      style="max-width: 180px"
                      :disabled="!!veiculoEncontrado"
                    />
                  </template>
                  <v-text-field
                    v-model="documento"
                    :label="tipo === 'VEICULO' ? 'Documento do condutor' : 'Documento'"
                    prepend-inner-icon="mdi-card-account-details"
                    density="compact"
                    class="flex-grow-1"
                    style="max-width: 260px"
                    @blur="buscarUsuario"
                  />
                  <v-select
                    v-model="destinoId"
                    :items="destinosOpcoes"
                    label="Destino"
                    density="compact"
                    class="flex-grow-1"
                    style="max-width: 300px"
                  />
                  <v-btn type="submit" color="primary" prepend-icon="mdi-login" class="mt-1">
                    Registrar entrada
                  </v-btn>
                </div>
              </v-form>

              <v-alert
                v-if="tipo === 'VEICULO' && placa && veiculoEncontrado"
                type="info"
                density="compact"
                class="mt-3"
              >
                Veículo já cadastrado: {{ veiculoEncontrado.placa }}
                <template v-if="veiculoEncontrado.marca || veiculoEncontrado.modelo">
                  ({{ veiculoEncontrado.marca }} {{ veiculoEncontrado.modelo }})
                </template>
              </v-alert>
              <v-alert
                v-if="tipo === 'VEICULO' && placa && !veiculoEncontrado && placa.trim().length >= 7"
                type="warning"
                density="compact"
                class="mt-3"
              >
                Veículo não cadastrado. Ele será criado ao registrar a entrada.
              </v-alert>
              <v-alert
                v-if="documento && usuarioEncontrado"
                type="info"
                density="compact"
                class="mt-3"
              >
                {{ usuarioEncontrado.nome }} · documento {{ usuarioEncontrado.documento }}
              </v-alert>
              <v-alert
                v-if="documento && !usuarioEncontrado && documento.trim().length >= 3"
                type="error"
                density="compact"
                class="mt-3"
              >
                Pessoa não encontrada para o documento informado.
              </v-alert>
            </template>

            <template v-else>
              <div class="d-flex flex-wrap ga-3 align-start">
                <v-text-field
                  v-model="textoBusca"
                  label="Placa ou documento"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  class="flex-grow-1"
                  style="max-width: 320px"
                  @keyup.enter="buscarSaida"
                />
                <v-btn color="primary" prepend-icon="mdi-magnify" class="mt-1" @click="buscarSaida">
                  Buscar
                </v-btn>
              </div>

              <div v-if="resultadoSaida.length" class="mt-3">
                <v-list density="compact">
                  <v-list-item
                    v-for="mov in resultadoSaida"
                    :key="mov.id"
                    :title="`${mov.identificacao} · ${mov.detalhe}`"
                    :subtitle="`Entrada ${formatarData(mov.entrada)} · ${mov.destino}`"
                  >
                    <template #append>
                      <v-btn color="warning" size="small" @click="confirmarSaida(mov)">
                        Registrar saída
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </template>
          </v-card-text>
    </v-card>
</template>