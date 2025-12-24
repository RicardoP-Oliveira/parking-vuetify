import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/destino`;

export default class TargetService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}