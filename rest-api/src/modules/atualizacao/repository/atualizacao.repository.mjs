import { parse } from 'csv-parse/sync'
import { gerarRegras, traduzirDGP } from './helps/csv.mjs'
import {
  formarUnidades,
  formarTratamento,
  unidadesConfig,
  tratamentosConfig,
  criarUsuariosConfig,
  validarRegistros
} from './helps/table.mjs'
import {
  buscarPorCampo,
  salvarRegistros,
  comTransacao
} from './helps/db.mjs'

const TAMANHO_LOTE = 25

class AtualizacaoRepository {
  async configurar(dados) {
    if (!dados?.dgp_dados || !dados?.dicionario_dados) {
      return { mensagem: 'Se faz necessário aos aquivos: dgp.csv e dicionario.csv' }
    }

    const regras = gerarRegras(dados.dicionario_dados)
    const dgpTraduzido = traduzirDGP(dados.dgp_dados, regras)
    const unidadesFinais = formarUnidades(dgpTraduzido)
    const tratamentosFinais = formarTratamento(dgpTraduzido)

    const resultadoUnidades = await this.sincronizar(
      unidadesConfig,
      unidadesFinais
    )

    const resultadoTratamentos = await this.sincronizar(
      tratamentosConfig,
      tratamentosFinais
    )

    const unidadesPorSigla = await buscarPorCampo(
      'unidades',
      'sigla',
      unidadesFinais
    )

    const tratamentosPorPostoGrad = await buscarPorCampo(
      'tratamentos',
      'postoGrad',
      tratamentosFinais
    )

    const usuariosConfig = criarUsuariosConfig({
      unidadesPorSigla,
      tratamentosPorPostoGrad
    })

    const resultadoUsuarios = await this.sincronizar(
      usuariosConfig,
      dgpTraduzido
    )

    // console.table(
    //   dgpTraduzido.map(
    //     ({ documento, postoGrad, nome, siglaUnidade }) => ({
    //       documento,
    //       postoGrad,
    //       nome,
    //       siglaUnidade,
    //       unidade_id: Number(unidadePorSigla.get(siglaUnidade)?.id) ?? null,
    //       tratamendo_id: Number(tratamentoPorSigla.get(postoGrad)?.id) ?? null,
    //     })
    //   )
    // )

    // console.log(unidadesFinais)
    // console.log({
    //   totalEncontradas: unidadesFinais.length,
    //   totalParaCriar: paraCriar.length,
    //   totalParaAtualizar: paraAtualizar.length,
    //   totalSemAlteracao: semAlteracao.length
    // })

    return {
      unidades: resultadoUnidades,
      tratamentos: resultadoTratamentos,
      usuarios: resultadoUsuarios
    }
  }

  async sincronizar(config, registros) {
    const dadosMapeados = registros.map(registro =>
      config.mapear(registro)
    )

    const existentesPorChave = await buscarPorCampo(
      config.modelo,
      config.chave,
      dadosMapeados
    )

    const resultado = validarRegistros(
      dadosMapeados,
      [...existentesPorChave.values()],
      config
    )

    const totalLotes = Math.ceil(
      Math.max(
        resultado.paraCriar.length,
        resultado.paraAtualizar.length
      ) / TAMANHO_LOTE
    )

    for (let i = 0; i < totalLotes; i++) {
      const inicio = i * TAMANHO_LOTE

      const loteCriar = resultado.paraCriar.slice(
        inicio,
        inicio + TAMANHO_LOTE
      )

      const loteAtualizar = resultado.paraAtualizar.slice(
        inicio,
        inicio + TAMANHO_LOTE
      )

      await comTransacao(async tx => {
        await salvarRegistros(
          config.modelo,
          {
            paraCriar: loteCriar,
            paraAtualizar: loteAtualizar
          },
          tx
        )
      })
    }

    return {
      encontradas: dadosMapeados.length,
      criadas: resultado.paraCriar.length,
      atualizadas: resultado.paraAtualizar.length,
      semAlteracao: resultado.semAlteracao.length
    }
  }

  async insertAll(tabela, dados) {

  }

}

export default AtualizacaoRepository;