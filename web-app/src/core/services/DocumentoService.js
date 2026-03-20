import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/document`;

export default class DocumentoService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}