import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/pedestre`;
const parking = `${ConfigClass.getUrlApi().toString()}/parking`;

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

  // static adicionarPedestre(dados, token) {
  //   return fetch(`${caminho}/pedestre`, {
  //     headers: {
  //       'Content-type': 'application/json;charset=UTF-8',
  //       Authorization: token,
  //     },
  //     body: JSON.stringify(dados),
  //     method: 'POST',
  //   }).then((res) => res.json());
  // }
}