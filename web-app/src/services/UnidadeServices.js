import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/ubm`;

export default class UbmService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}