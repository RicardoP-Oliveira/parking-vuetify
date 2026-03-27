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
    bufferPages: true,
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
  const rowHeight = 14
  const footerReserve = 40

  for (const item of dados) {
    const bottomLimit = doc.page.height - doc.page.margins.bottom - footerReserve

    if (y + rowHeight > bottomLimit) {
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

  const range = doc.bufferedPageRange()
  const totalPages = range.count

  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(range.start + i)
    drawPdfFooter(doc, {
      data: dataGeracao,
      pageNumber: i + 1,
      totalPages,
      total: dados.length,
      showTotal: i === 0
    })
  }

  return { doc, nomeArquivo }
}