import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/document`;

export default class TipoDocService {
  static getDocs() {
    return fetch(caminho).then((res) => res.json());
  }
}