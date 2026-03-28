export const formatPdfDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(value))
}

export const formatPdfDateTime = () =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date())

export const buildAutoTableColumns = (
  doc,
  columns,
  {
    startX = doc.page.margins.left,
    endX = doc.page.width - doc.page.margins.right,
    gap = 8
  } = {}
) => {
  const totalFlex = columns.reduce((sum, col) => sum + (col.flex || 1), 0)
  const totalGap = gap * (columns.length - 1)
  const availableWidth = endX - startX - totalGap

  let currentX = startX

  return columns.map(col => {
    const width = (availableWidth * (col.flex || 1)) / totalFlex

    const finalCol = {
      ...col,
      x: currentX,
      width
    }

    currentX += width + gap
    return finalCol
  })
}

export const drawGroupedPdfTableHeader = (doc, columns, startX, y, endX) => {
  const groupedColumns = columns.filter(col => col.group)
  const plainColumns = columns.filter(col => !col.group)

  const groups = []
  let current = null

  groupedColumns.forEach(col => {
    if (!current || current.name !== col.group) {
      current = {
        name: col.group,
        startX: col.x,
        endX: col.x + col.width,
      }
      groups.push(current)
    } else {
      current.endX = col.x + col.width
    }
  })

  doc.font('Helvetica-Bold').fontSize(10)

  groups.forEach(group => {
    doc.text(group.name, group.startX, y, {
      width: group.endX - group.startX,
      align: 'center',
      lineBreak: false,
    })

    doc.moveTo(group.startX, y + 14)
      .lineTo(group.endX, y + 14)
      .stroke()
  })

  const subY = y + 20

  doc.font('Helvetica-Bold').fontSize(9)

  columns.forEach(col => {
    doc.text(col.title, col.x, subY, {
      width: col.width,
      align: col.align || 'left',
      lineBreak: false,
      ellipsis: true,
    })
  })

  groups.forEach(group => {
    doc.moveTo(group.startX, subY + 12)
      .lineTo(group.endX, subY + 12)
      .stroke()
  })

  plainColumns.forEach(col => {
    doc.moveTo(col.x, subY + 12)
      .lineTo(col.x + col.width, subY + 12)
      .stroke()
  })

  doc.font('Helvetica')
  return subY + 18
}

export const drawPdfTableHeader = (doc, columns, startX, y, endX = 810) => {
  doc.font('Helvetica-Bold').fontSize(9)

  columns.forEach(col => {
    doc.text(col.title, col.x, y, {
      width: col.width,
      align: col.align || 'left',
      lineBreak: false,
      ellipsis: true,
    })
  })

  const lineY = y + 8
  doc.moveTo(startX, lineY).lineTo(endX, lineY).stroke()
  doc.font('Helvetica')

  return y + 20
}

export const drawPdfTableRow = (doc, columns, row, y, valueMapper, rowIndex = 0) => {
  const rowHeight = 14
  const rowStartX = columns[0].x
  const rowEndX = columns[columns.length - 1].x + columns[columns.length - 1].width
  const textY = y + 2

  if (rowIndex % 2 === 1) {
    doc.save()
    doc.rect(rowStartX, y, rowEndX - rowStartX, rowHeight)
      .fill('#eee')
    doc.restore()
  }

  doc.fillColor('black')
  doc.fontSize(8)

  columns.forEach(col => {
    const value = valueMapper ? valueMapper(row, col.key) : String(row?.[col.key] ?? '-')

    doc.text(value, col.x, textY + 2, {
      width: col.width,
      height: rowHeight - 2,
      align: col.align || 'left',
      ellipsis: true,
      lineBreak: false
    })
  })

  doc.moveTo(rowStartX, y + rowHeight)
  .lineTo(rowEndX, y + rowHeight)
  .strokeColor('#e0e0e0')
  .stroke()

  return y + rowHeight
}

export const drawPdfHeader = (doc, { cabecalho, subTitulo, tipo, filtrosTexto }) => {
  const left = doc.page.margins.left
  const right = doc.page.width - doc.page.margins.right
  const contentWidth = right - left

  const isVeiculo = tipo === 'VEICULO'

  const logoWidth = isVeiculo ? 34 : 30
  const logoY = isVeiculo ? 10 : 8
  const logoX = (doc.page.width - logoWidth) / 2

  const cabecalhoY = isVeiculo ? 58 : 46
  const subTituloY = isVeiculo ? 109 : 88
  const filtrosY = isVeiculo ? 128 : 108
  
  const subTituloFont = isVeiculo ? 14 : 13
  const cabecalhoFont = isVeiculo ? 10 : 9

  


  doc.image('src/shared/assets/logo.png', logoX, logoY, {
    width: logoWidth,
  })

  doc.font('Helvetica')
    .fontSize(cabecalhoFont)
    .text(cabecalho, left, cabecalhoY, {
      width: contentWidth,
      align: 'center',
    })

  doc.font('Helvetica-Bold')
    .fontSize(subTituloFont)
    .text(subTitulo, left, subTituloY, {
      width: contentWidth,
      align: 'center',
      lineBreak: false,
    })

  doc.font('Helvetica')
    .fontSize(9)
    .text(`Filtros: ${filtrosTexto}`, left, filtrosY, {
      width: contentWidth,
      align: 'center'
    })

  const lineY = isVeiculo ? filtrosY + 28 : filtrosY + 22

  doc.moveTo(left, lineY)
    .lineTo(right, lineY)
    .stroke()

  return isVeiculo ? lineY + 8 : lineY + 6
}

export const drawPdfFooter = (doc, { data, pageNumber, totalPages, total, showTotal = false }) => {
  const left = doc.page.margins.left
  const right = doc.page.width - doc.page.margins.right
  const pageHeight = doc.page.height
  const contentWidth = right - left

  const footerLineY = pageHeight - doc.page.margins.bottom - 18
  const footerTextY = footerLineY + 6

  doc.save()

  doc.moveTo(left, footerLineY)
    .lineTo(right, footerLineY)
    .strokeColor('black')
    .stroke()

  doc.font('Helvetica')
    .fontSize(9)
    .fillColor('black')

  doc.text(`Gerado em: ${data}`, left, footerTextY, {
    width: contentWidth / 3,
    align: 'left',
    lineBreak: false,
  })

  if (showTotal) {
    doc.text(`Total de registro(s): ${total}`, left + contentWidth / 3, footerTextY, {
      width: contentWidth / 3,
      align: 'center',
      lineBreak: false,
    })
  }

  doc.text(`Página ${pageNumber}/${totalPages}`, left + (contentWidth * 2 / 3), footerTextY, {
    width: contentWidth / 3,
    align: 'right',
    lineBreak: false,
  })

  doc.restore()
}

export const buildRelatorioFiltrosTexto = (filters = {}) => {
  const partes = []

  const {
    placa,
    prefixo,
    documento,
    condutor,
    dataInicio,
    dataFim,
    horaInicio,
    horaFim
  } = filters

  if (placa) partes.push(`Placa: ${placa}`)
  if (prefixo) partes.push(`Prefixo: ${prefixo}`)
  if (documento) partes.push(`Documento: ${documento}`)
  if (condutor) partes.push(`Condutor/Nome: ${condutor}`)
  
  if (dataInicio || dataFim) {
    const inicio = formatPdfDate(dataInicio)
    const fim = formatPdfDate(dataFim)

    if (dataInicio && dataFim) {
      partes.push(`Período: ${inicio} a ${fim}`)
    } else {
      partes.push(`Data: ${inicio || fim}`)
    }
  } 
  
  if (horaInicio || horaFim) {
    const inicio = horaInicio || '...'
    const fim = horaFim || '...'

    if (horaInicio && horaFim) {
      partes.push(`Hora: ${inicio} a ${fim}`)
    } else {
      partes.push(`Hora: ${inicio || fim}`)
    }
  }

  return partes.length
    ? partes.join(' • ')
    : 'Sem filtros específicos'
}