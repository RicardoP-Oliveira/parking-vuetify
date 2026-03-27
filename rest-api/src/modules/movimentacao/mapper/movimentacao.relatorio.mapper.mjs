import { formatPdfDate } from '../../../shared/utils/pdfUtils.mjs'
import { getTimestamp } from '../../../shared/utils/mapperUtils.mjs'

export const getRelatorioCabecalho = () => {
  return `Secretaria de Estado de Defesa Civil\nCorpo de Bombeiros Militar do Estado do Rio de Janeiro\nComplexo de Ensino e Instrução Coronel Sarmento - CEICS`
}

export const getRelatorioSubTituloByTipo = tipo => {
  return tipo === 'VEICULO'
    ? 'Relatório de Movimentações - Veículos'
    : 'Relatório de Movimentações - Pedestres'
}

export const getRelatorioNomeArquivoByTipo = tipo => {
  const timestamp = getTimestamp()

  return tipo === 'VEICULO'
    ? `relatorio-veiculos-${timestamp}.pdf`
    : `relatorio-pedestres-${timestamp}.pdf`
}

export const getRelatorioColumnsByTipo = tipo => {
  if (tipo === 'VEICULO') {
    return [
      { title: 'Placa', key: 'placa', flex: 1, align: 'center' },
      { title: 'Marca', key: 'marca', flex: 1.2 },
      { title: 'Prefixo', key: 'prefixo', flex: 0.7, align: 'center' },
      { title: 'Doc.', key: 'e_documento', flex: 1, align: 'center', group: 'Entrada' },
      { title: 'Condutor', key: 'e_nomeCompleto', flex: 2.4, group: 'Entrada' },
      { title: 'Data', key: 'entrada', flex: 0.9, align: 'center', group: 'Entrada' },
      { title: 'Hora', key: 'hEntrada', flex: 1.2, align: 'left', group: 'Entrada' },
      { title: 'Destino', key: 'destino_sigla', flex: 0.8, align: 'center'},
      { title: 'Doc.', key: 's_documento', flex:1, align: 'center', group: 'Saída' },
      { title: 'Condutor', key: 's_nomeCompleto', flex: 2.4, group: 'Saída' },      
      { title: 'Data', key: 'saida', flex: 0.9, align: 'center', group: 'Saída' },
      { title: 'Hora', key: 'hSaida', flex: 1.2, align: 'left', group: 'Saída' },
    ]
  }

  return [
    { title: 'Doc.', key: 'e_documento', flex: 1, align: 'center' },
    { title: 'Militar / Visitante', key: 'e_nomeCompleto', flex: 2.4 },
    { title: 'Entrada', key: 'entrada', flex: 0.9, align: 'center'},
    { title: 'Hora Ent.', key: 'hEntrada', flex: 0.9, align: 'right'},
    { title: 'Saída', key: 'saida', flex: 0.9, align: 'center'},
    { title: 'Hora Saída', key: 'hSaida', flex: 0.9, align: 'right' },
    { title: 'Destino', key: 'destino_sigla', flex: 0.9, align: 'center' },
  ]
}



export const mapRelatorioRowValue = (row, key) => {
  const value = row?.[key]

  if (!value) return '-'

  if (key === 'entrada' || key === 'saida') {
    return formatPdfDate(value)
  }

  return String(value)
}