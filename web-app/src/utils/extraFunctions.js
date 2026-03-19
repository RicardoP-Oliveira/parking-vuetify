// src/utils/extraFunctions.js

const cache = new Map()
const TTL = 1000 * 60 * 5

const nomeResolvido = (val) => 
  val = `${val.graduaAbrev} ${val.orgaoSigla} ${val.condutor}`

const getKey = (valor) => valor.trim().toUpperCase()

const isValid = (entry) => {
  return Date.now() - entry.time < TTL
}

const getFromCache = (key) => {
  if (!cache.has(key)) return null
  const entry = cache.get(key)

  if (isValid(entry)) {
    return entry
  }

  cache.delete(key)
  return null
}

const saveCache = (key, data) => {
  cache.set(key, {
    ...data,
    time: Date.now()
  })

  if (cache.size > 50) {
    const firstKey = cache.keys().next().value
    cache.delete(firstKey)
  }
}

const getExtra = (service, key, isCarro) => {
  const cached = getFromCache(key)

  if (cached?.extraPromise) {
    return cached.extraPromise
  }

  const extraPromise = isCarro
    ? service.getCarroPlaca(key)
    : service.getUsuarioByDoc(key)

  saveCache(key, { extraPromise })
  return extraPromise
}

export function useAcessoService(service) {
  const buscarServicos = async (valor, isCarro, tipoTab) => {
    const key = getKey(valor)

    const infoPromise = service.getInfo({ ident: key, tab: tipoTab })

    const extraPromise = getExtra(service, key, isCarro)

    return Promise.all([infoPromise, extraPromise])
  }
  return { buscarServicos }
}

export function useAcessoMapper() {
  const mapUser = (u) => ({
    user_id: u.user_id,
    nome: u.nomeCompleto || nomeResolvido(u),
    ubm_id: u.ubm_id,
    orgao_id: u.orgao_id,
    gradua_id: u.gradua_id,
    documento: u.doc || u.documento
  })

  const mapCarro = (c) => ({
    carro_id: c.id,
    placa: c.placa,
    modelo: c.marca,
    orgao_id: c.orgao_id,
    user_id: c.user_id
  })

  return {
    mapUser,
    mapCarro
  }
}

export const getUser = async (service, val) => {
  if (!val || val.length < 4) return null

  try {
    const user = await service.getUsuarioByDoc(getKey(val))
    return user?.dados || null
  } catch (err) {
    console.err('Erro getUser:', err)
    return null
  }
}