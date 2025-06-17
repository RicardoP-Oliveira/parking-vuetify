import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/ceics`;
const parking = `${ConfigClass.getUrlApi().toString()}/parking`;

export default class CeicsService {
  static getTodos(page, perPage, token, key='', filters = {}) {
    let queryString = `page=${page}&perPage=${perPage}`;

    if(key) {
      queryString += `&query=${key}`;
    }

    for (const filterKey in filters) {
      const filterValue = filters[filterKey];
      if (filterKey !== null && filterKey !== undefined && filterKey !== ''){
        if (filterKey.startsWith('data') && filterValue instanceof Date) {
          queryString += `&${filterKey}=${filterValue.toISOString.split('T')[0]}`;
        } else if (filterKey.startsWith('hora') && typeof filterValue === 'string') {
          queryString += `&${filterKey}=${encodeURIComponent(filterValue)}`;
        } else {
          queryString += `&${filterKey}=${encodeURIComponent(filterValue)}`;
        }
      }
    }
    return fetch(`${caminho}?${queryString}`, {
      headers: {
        Authorization: token
      }
    }).then((res) => res.json());
  }

  static getInfo(placa, token) {
    return fetch(`${caminho}/${placa}`, {
      headers: {
        Authorization: token,
      }
    }).then((res) => res.json());
  }

  static getParking(placa, token) {
    return fetch(`${parking}/${placa}`, {
      headers: {
        Authorization: token,
      }
    }).then((res) => res.json());
  }

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