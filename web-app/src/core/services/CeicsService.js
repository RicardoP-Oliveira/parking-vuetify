import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/ceics`;

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

  static getInfo({ident, tab}, token) {
    return fetch(`${caminho}/${ident}`, {
      headers: {
        Authorization: token,
        'tab': tab
      }
    }).then((res) => res.json());
  }

  static cadastrarSaida(dados, token) {
    return fetch(caminho, {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: token,
      },
      body: JSON.stringify(dados),
      method: 'PUT',
    }).then((res) => res.json());
  }

  static adicionar({dados, tab}, token) {
    return fetch(caminho, {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: token,
        'tab': tab,
      },
      body: JSON.stringify(dados),
      method: 'POST',
    }).then((res) => res.json());
  }

}