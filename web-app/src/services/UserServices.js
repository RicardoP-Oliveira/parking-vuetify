import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/user`;

export default class UserService {
  static getId(id, token) {
    return fetch(`${caminho}/${id}`, {
      headers: {
        Authorization: token,
      }
    }).then((res) => res.json());
  }

  static adicionar(formData, token) {
    return fetch(caminho, {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: token,
      },
      body: JSON.stringify(formData),
      method: 'POST',
    }).then((res) => res.json());
  }
}