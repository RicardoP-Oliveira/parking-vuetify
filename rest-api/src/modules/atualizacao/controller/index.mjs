import createAtualizacaoController from './atualizacao.controller.mjs';
import atualizacaoService from '../service/index.mjs';

const atualizacaoController = createAtualizacaoController(atualizacaoService);

export default atualizacaoController;