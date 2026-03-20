const cache = new Map()
const TTL = 1000 * 60 * 5

const getKey = (valor) => valor.trim().toUpperCase()

const isValid = (entry) => Date.now() - entry.time < TTL

const getFromCache = (key) => {
  if (!cache.has(key)) return null
  const entry = cache.get(key)

  if (isValid(entry)) return entry

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

export function useCache(service) {
  const buscarServicos = async (valor, isCarro, tipoTab) => {
    const key = getKey(valor)

    const infoPromise = service.getInfo({ ident: key, tab: tipoTab })
    const extraPromise = getExtra(service, key, isCarro)

    return Promise.all([infoPromise, extraPromise])
  }

  const getUser = async (valor) => {
  if (!valor || valor.length < 4) return null

    try {
      const key = getKey(valor)
      const user = await service.getUsuarioByDoc(key)
      return user?.dados || null
    } catch (err) {
      console.err('Erro getUser:', err)
      return null
    }
  }
  return {
    buscarServicos,
    getUser
  }
}