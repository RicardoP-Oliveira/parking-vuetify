import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/hierarquia`;

export default class TratramentoService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}