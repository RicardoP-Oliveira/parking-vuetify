import PDFDocument from 'pdfkit'
import {
  getRelatorioCabecalho, getRelatorioSubTituloByTipo,
  getRelatorioNomeArquivoByTipo, getRelatorioColumnsByTipo,
  mapRelatorioRowValue,
} from '../mapper/index.mjs'
import {
  formatPdfDateTime, drawGroupedPdfTableHeader, drawPdfTableRow,
  buildAutoTableColumns, drawPdfHeader, drawPdfFooter,
  drawPdfTableHeader, buildRelatorioFiltrosTexto
} from '../../../shared/utils/pdfUtils.mjs'

export const buildMovimentacaoPdfReport = ({ tipo, dados, filtros }) => {
  const doc = new PDFDocument({
    size: 'A4',
    layout: tipo === 'VEICULO' ? 'landscape' : 'portrait',
    margin: 30,
    bufferPages: false,
  })

  const cabecalho = getRelatorioCabecalho()
  const subTitulo = getRelatorioSubTituloByTipo(tipo)
  const nomeArquivo = getRelatorioNomeArquivoByTipo(tipo)
  const rawColumns = getRelatorioColumnsByTipo(tipo)
  const dataGeracao = formatPdfDateTime()
  const filtrosTexto =  buildRelatorioFiltrosTexto(filtros)

  let columns = buildAutoTableColumns(doc, rawColumns, { gap: 8 })
  let pageNumber = 1

  let y = drawPdfHeader(doc, {
    cabecalho,
    subTitulo,
    filtrosTexto,
  })

  const hasGroup = columns.some(col => col.group)

  if (hasGroup) {
    y = drawGroupedPdfTableHeader(
      doc,
      columns,
      columns[0].x,
      y,
      doc.page.width - doc.page.margins.right
    )
  } else {
    y = drawPdfTableHeader(
      doc,
      columns,
      columns[0].x,
      y,
      doc.page.width - doc.page.margins.right
    )
  }

  const footerReserve = 40
  const rowHeight = 14

  const bottomLimit =
    doc.page.height -
    doc.page.margins.bottom -
    footerReserve
  
  const linhasPorPagina = Math.floor(
    (bottomLimit - y) / rowHeight
  )

  const totalPages = Math.max(
    1,
    Math.ceil(dados.length / linhasPorPagina)
  )

  if (!dados.length) {
    doc.fontSize(12).text(
      'Nenhum registro encontrado para os filtros informados.',
      30,
      y + 10,
      {
        width: doc.page.width - 60,
        align: 'center',
      }
    )

    return { doc, nomeArquivo }
  }

  let rowIndex = 0

  for (const item of dados) {
    const bottomLimit = doc.page.height - doc.page.margins.bottom - footerReserve

    if (y + rowHeight > bottomLimit) {
      
      drawPdfFooter(doc, {
        data: dataGeracao,
        pageNumber,
        total: dados.length,
        totalPages,
        showTotal: false
      })

      pageNumber += 1

      doc.addPage({
        size: 'A4',
        layout: tipo === 'VEICULO' ? 'landscape' : 'portrait',
        margin: 30,
      })

      columns = buildAutoTableColumns(doc, rawColumns, { gap: 8 })

      y = drawPdfHeader(doc, {
        cabecalho,
        subTitulo,
        filtrosTexto,
      })

      if (hasGroup) {
        y = drawGroupedPdfTableHeader(
          doc,
          columns,
          columns[0].x,
          y,
          doc.page.width - doc.page.margins.right
        )
      } else {
        y = drawPdfTableHeader(
          doc,
          columns,
          columns[0].x,
          y,
          doc.page.width - doc.page.margins.right
        )
      }
    }
    y = drawPdfTableRow(doc, columns, item, y, mapRelatorioRowValue, rowIndex)
    rowIndex += 1

  }

  drawPdfFooter(doc, {
    data: dataGeracao,
    pageNumber,
    total: dados.length,
    totalPages,
    showTotal: pageNumber === totalPages
  })

  return { doc, nomeArquivo }
}