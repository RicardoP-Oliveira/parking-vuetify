import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/servico`;
const parking = `${ConfigClass.getUrlApi().toString()}/parking`;

export default class ServicoService {
  static getAll(token, key='') {
    if (!key) {
      return fetch(caminho, {
        headers: {
          Authorization: token
        }
      }).then((res) => res.json())
    }
    return fetch(`${caminho}?query=${key}`, {
      headers: {
        Authorization: token
      }
    }).then((res) => res.json())
  }
}