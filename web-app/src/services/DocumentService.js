import ConfigClass from '../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/document`;

export default class DocumentService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}