import prisma from '../../../../shared/database/prisma.mjs'

export function comTransacao(callback, opcoes = {}) {
  return prisma.$transaction(callback, {
    maxWait: 10_000,
    timeout: 30_000,
    ...opcoes
  })
}

export async function buscarPorCampo(modelo, campo, registros, client = prisma) {
  const tabela = client[modelo]

  if (!tabela?.findMany) {
    throw new Error(`Modelo Prisma inválido: ${modelo}`)
  }
  console.log(`modelo: ${modelo} | campo: ${campo}`)
  const valores = [
    ...new Set(
      registros
        .map(registro => registro[campo])
        .filter(valor => valor != null && String(valor).trim() !== '')
    )
  ]

  if (valores.length === 0) return new Map()

  const encontrados = await tabela.findMany({
    where: {
      [campo]: { in: valores }
    }
  })

  return new Map(encontrados.map(item => [item[campo], item]))
}

export async function salvarRegistros(
  modelo,
  { paraCriar, paraAtualizar },
  client = prisma
) {
  const tabela = client[modelo]

  if (!tabela?.createMany || !tabela?.update) {
    throw new Error(`Modelo Prisma inválido ou sem operações necessárias: ${modelo}`)
  }

  if (paraCriar.length > 0) {
    await tabela.createMany({
      data: paraCriar
    })
  }

  for (const registro of paraAtualizar) {
    await tabela.update({
      where: registro.where,
      data: registro.data
    })
  }

  return {
    criadas: paraCriar.length,
    atualizadas: paraAtualizar.length
  }
}

// export async function criarUnidades(unidades, client = prisma) {
//   if (unidades.length === 0) return 0

//   const resultado = await client.unidades.createMany({
//     data: unidades.map(({ sigla, unidade }) => ({ sigla, unidade }))
//   })

//   return resultado.count
// }

// export async function atualizarUnidades(unidades, client = prisma) {
//   if (unidades.length === 0) return 0

//   const atualizadoEm = new Date()

//   for (const { sigla, unidade } of unidades) {
//     await client.unidades.update({
//       where: { sigla },
//       data: {
//         unidade,
//         updated_at: atualizadoEm
//       }
//     })
//   }

//   return unidades.length
// }