// Teste de leitura do Sistema_DGP.csv + dicionário de tradução de unidades
// Rodar:
//   node scripts/testar-csv.mjs "<csv do DGP>" "<csv do dicionario>"

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CSV_PATH = process.argv[2]
  ? resolve(process.argv[2])
  : '/mnt/c/Users/artno/OneDrive/Desktop/sistema DGP.csv'

const DICT_CSV = process.argv[3]
  ? resolve(process.argv[3])
  : '/mnt/c/Users/artno/OneDrive/Desktop/dicionario.csv'

// O CSV do DGP está em UTF-8 (confirmado no DBeaver)
function lerCsv(path) {
  return readFileSync(path, 'utf-8').replace(/^\uFEFF/, '')
}

function parseCsv(text, delimiter) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
      continue
    }
    if (c === '"') inQuotes = true
    else if (c === delimiter) { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') { /* ignora */ }
    else field += c
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

function detectDelimiter(headerLine) {
  const semis = (headerLine.match(/;/g) || []).length
  const commas = (headerLine.match(/,/g) || []).length
  return semis >= commas ? ';' : ','
}

function limpar(valor) {
  if (valor == null) return ''
  return String(valor)
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2007\u202F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extrairTratamento(potoGrad) {
  const limpo = limpar(potoGrad)
  if (!limpo) return null
  const idx = limpo.toUpperCase().indexOf(' BM')
  const sigla = idx === -1 ? limpo : limpo.slice(0, idx)
  return limpar(sigla)
}

// ---------- DICIONARIO ----------
function carregarDicionario() {
  const raw = lerCsv(DICT_CSV)
  const primeiro = raw.split(/\r?\n/, 1)[0]
  const rows = parseCsv(raw, detectDelimiter(primeiro))
  const header = rows.shift().map(h => limpar(h).toLowerCase())

  const iRegex = header.indexOf('padrao_regex')
  const iTrad = header.indexOf('traducao')
  if (iRegex === -1 || iTrad === -1) {
    throw new Error(`Dicionário sem colunas esperadas. Cabeçalho: ${header.join(' | ')}`)
  }

  const dict = []
  for (const row of rows) {
    const regex = limpar(row[iRegex])
    const traducao = limpar(row[iTrad])
    if (!regex || !traducao) continue
    if (/^\d+$/.test(traducao)) continue // ignora linha de total, se houver
    try {
      new RegExp(regex, 'i') // valida antes de guardar
    } catch {
      console.warn(`Padrão inválido em JS, ignorado: ${regex}`)
      continue
    }
    dict.push({ regex, traducao })
  }
  return dict
}

function traduzirUnidade(nome, dicionario) {
  for (const { regex, traducao } of dicionario) {
    if (new RegExp(regex, 'i').test(nome)) return traducao
  }
  return nome
}

// Tradução do CASE do seu SQL para JS.
// Entrada: unidade já traduzida. Saída: sigla.
function gerarSigla(nome) {
  // WHEN ilike 'dbm%' OR ilike 'PABM%' -> regexp_replace(nome, ' \-.*$', '', 'i')
  if (/^dbm/i.test(nome) || /^pabm/i.test(nome)) {
    return nome.replace(/ \-.*$/i, '')
  }

  // WHEN ilike '%odontocl%' -> substring('^([0-9]+[ªº])') || ' Odonto'
  if (/odontocl/i.test(nome)) {
    return (nome.match(/^([0-9]+[ªº])/) || ['', ''])[1] + ' Odonto'
  }

  // WHEN ilike '%policl%' -> substring('^([0-9]+[ªº])') || ' Policínica'
  if (/policl/i.test(nome)) {
    return (nome.match(/^([0-9]+[ªº])/) || ['', ''])[1] + ' Policínica'
  }

  // WHEN ilike 'CBA%' -> substring('^(CBA\s\S+)')
  if (/^cba/i.test(nome)) {
    return (nome.match(/^(cba\s\S+)/i) || ['', ''])[1]
  }

  // WHEN ilike '%GB% -%' OR ilike '%GS%- %' OR ilike '%GM%- %'
  //     -> substring('^([0-9]+[º]\s\S+)')
  if (/gb.*-/i.test(nome) || /gs.*-/i.test(nome) || /gm.*-/i.test(nome)) {
    const m = nome.match(/^([0-9]+[º]\s\S+)/)
    return m ? m[1] : '' // fiel ao SQL: substring sem match devolve NULL
  }

  // WHEN ilike '% - %' AND NOT (exclusões) -> trim(regexp_replace(nome, '^.* \- ', ''))
  if (nome.includes(' - ') && !/(^dbm.*-|^pabm.*-|odontocl|policl|^cba.*-|^\d+º\s(gb|gs|gm).*-)/i.test(nome)) {
    return nome.replace(/^.* - /, '').trim()
  }

  // ELSE -> nome
  return nome
}

// ---------- MAIN ----------
function main() {
  const dicionario = carregarDicionario()
  console.log(`Dicionário carregado: ${dicionario.length} padrões`)
  console.log('---')

  const raw = lerCsv(CSV_PATH)
  const primeiro = raw.split(/\r?\n/, 1)[0]
  const rows = parseCsv(raw, detectDelimiter(primeiro))

  const header = rows.shift().map(h => limpar(h).toLowerCase())
  console.log('Delimitador:', detectDelimiter(primeiro))
  console.log('Cabeçalho:', header.join(' | '))
  console.log('Linhas de dados:', rows.length)
  console.log('---')

  const colPoto = header.indexOf('poto/grad')
  const colNome = header.indexOf('nome')
  const colNomeGuerra = header.indexOf('nome de guerra')
  const colIdFunc = header.indexOf('rg')
  const colUnidade = header.indexOf('unidade')

  // Primeiras 5 linhas (valida acentos)
  console.log('Primeiras 5 linhas:')
  for (const row of rows.slice(0, 5)) {
    const rg = String(row[colIdFunc] ?? '').replace(/^0+/, '')
    console.log(JSON.stringify({
      poto_grad: row[colPoto],
      nome: row[colNome],
      nome_de_guerra: row[colNomeGuerra],
      rg,
      unidade: row[colUnidade],
    }))
  }
  console.log('---')

  // Tratamentos únicos (antes de " BM")
  const tratamentos = new Set()
  for (const row of rows) {
    const t = extrairTratamento(row[colPoto])
    if (t) tratamentos.add(t)
  }
  console.log('Tratamentos únicos:', tratamentos.size)
  console.log([...tratamentos].sort())
  console.log('---')

	// 2) UNIDADES TRADUZIDAS + SIGLA
const traduzidas = new Map() // traduzida -> { original, sigla }
for (const row of rows) {
  const u = limpar(row[colUnidade])
  if (!u) continue
  const t = traduzirUnidade(u, dicionario)
  if (!traduzidas.has(t)) traduzidas.set(t, { original: u, sigla: gerarSigla(t) })
}

let casaram = 0
for (const [t, { original }] of traduzidas) {
  if (t !== original) casaram++
}

console.log(`Unidades únicas (traduzidas): ${traduzidas.size}`)
console.log(`Traduzidas pelo dicionário: ${casaram} de ${traduzidas.size}`)
console.log('Amostra (10) — original -> traduzida -> sigla:')
for (const [t, { original, sigla }] of [...traduzidas]) {
  console.log(`${t} -> ${sigla}`)
}
	
  // 1) UNIDADES ÚNICAS (normalizadas, sem tradução)
  const unidades = new Set()
  for (const row of rows) {
    const u = limpar(row[colUnidade])
    if (u) unidades.add(u)
  }
  console.log('Unidades únicas (normalizadas):', unidades.size)
  console.log('Amostra (10):')
  console.log([...unidades].slice(0, 10))
  console.log('---')

  
}

main()