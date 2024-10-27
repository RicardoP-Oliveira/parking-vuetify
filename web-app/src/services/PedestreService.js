import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/pedestre`;

export default class PedestreService {
  static getTodos(page, perPage, token, key='') {
    if (!key) {
      return fetch(`${caminho}?page=${page}&perPage=${perPage}`, {
        headers: {
          Authorization: token
        }
      }).then( (res) => res.json() );
    } 
    return fetch(`${caminho}?query=${key}&page=${page}&perPage=${perPage}`, {
      headers: {
        Authorization: token,
      },
    }).then((res) => res.json());
  }

  static getByDoc(doc, token) {
    return fetch(`${caminho}/doc/${doc}`, {
      headers: {
        Authorization: token,
      }
    }).then ((res) => res.json());
  }

  // static getInfo(placa, token) {
  //   return fetch(`${caminho}/${placa}`, {
  //     headers: {
  //       Authorization: token,
  //     }
  //   }).then((res) => res.json());
  // }

  // static getParking(placa, token) {
  //   return fetch(`${parking}/${placa}`, {
  //     headers: {
  //       Authorization: token,
  //     }
  //   }).then((res) => res.json());
  // }

  static adicionar(dados, token) {
    return fetch(caminho, {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: token,
      },
      body: JSON.stringify(dados),
      method: 'POST',
    }).then((res) => res.json());
  }
}