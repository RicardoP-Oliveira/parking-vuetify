import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/orgao`;

export default class OrgaoService {
  static getOrgaos() {
    return fetch(caminho).then((res) => res.json());
  }
}