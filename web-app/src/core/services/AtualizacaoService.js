import ConfigClass from "@/class/configClass"

const caminho = `${ConfigClass.getUrlApi().toString()}/atualizacao`

export default class AtualizacaoService {
  static getTest() {
    return fetch(caminho).then((res) => res.json());
  }

  static async importar(arquivos) {
    const formData = new FormData()

    for (const arquivo of arquivos) {
      formData.append('arquivos', arquivo)
    }


    const response = await fetch(`${caminho}/importar`, {
      method: 'POST',
      body: formData
    })

    const resultado = await response.json()

    if (!response.ok) {
      throw new Error(resultado.message ?? 'Falha ao enviar os arquivos')
    }
    return resultado
  }
}