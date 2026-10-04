import { parse } from 'csv-parse/sync'
import { gerarSigla } from './table.mjs'

function getDelimiter(dados) {
  return dados.split(/\r?\n/, 1)[0].includes(';') ? ';' : ','
}

export function lerCSV(dados) {

  const options = {
    columns: true,
    delimiter: getDelimiter(dados),
    bom: true,
    skip_empty_lines: true,
    trim: true
  }

  return parse(dados, options)
}

export function gerarRegras(dados) {
  return lerCSV(dados).map(item => ({
    regex: new RegExp(item.padrao_regex, 'i'),
    traducao: item.unidade_traduzida
  }))
}

function obterNomeGuerra(registro) {
  const nGuerra = String(registro['Nome de Guerra'] ?? '').trim()
  const particulas = new Set(['DE', 'DO', 'DA', 'DOS', 'DAS', 'E'])

  if (nGuerra) return nGuerra

  const palavras = String(registro.Nome ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const nomesValidos = palavras.filter(palavra => {
    const palavraNormalizada = palavra
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    return !particulas.has(palavraNormalizada)
  })

  if (nomesValidos.length === 0) return ''

  const indiceAleatorio = Math.floor(Math.random() * nomesValidos.length)
  return nomesValidos[indiceAleatorio]
}

function obterSiglaTratamento(registro) {
  const postoGrad = String(
    registro['Poto/Grad'] ?? registro['Poto/Grad'] ?? ''
  ).trim()

  const indiceBM = postoGrad.search(/\sBM\b/i)

  if (indiceBM === -1) return ''
  return postoGrad.slice(0, indiceBM).trim()
}

export function traduzirDGP(dados, regras) {
  return lerCSV(dados).map(registro => {
    const unidade = (registro.Unidade ?? '')
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    const regra = regras.find(({ regex }) => regex.test(unidade))
    const unidade_traduzida = regra?.traducao?.trim() || unidade
    return {
      unidade: unidade_traduzida,
      siglaUnidade: gerarSigla(unidade_traduzida),
      nome: obterNomeGuerra(registro),
      documento: String(registro.RG).replace(/^0+/, ''),
      postoGrad: obterSiglaTratamento(registro)
    }
  })
}