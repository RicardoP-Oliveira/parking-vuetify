import { jwtDecode } from 'jwt-decode';
import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/sessions/`;

export default class SessionService {
  static async logar(formLogin) {
    const response = fetch(caminho, {
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify(formLogin),
      method: 'POST',
    }).then((res) => res.json());
    return (response);
  }
}