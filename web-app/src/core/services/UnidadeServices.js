import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/unidade`;

export default class UnidadeService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}