import ConfigClass from '../../class/configClass';

const caminho = `${ConfigClass.getUrlApi().toString()}/ubm/orgaos`;

export default class OrgaoService {
  static getOrgaos() {
    return fetch(caminho).then((res) => res.json());
  }
}