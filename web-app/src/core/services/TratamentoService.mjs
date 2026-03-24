import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/tratamento`;

export default class TratamentoService {
  static getTodos() {
    return fetch(caminho).then((res) => res.json());
  }
}