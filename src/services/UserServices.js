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
}