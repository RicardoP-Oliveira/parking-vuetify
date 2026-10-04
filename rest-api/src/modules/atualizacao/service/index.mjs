import createAtualizacaoService from './atualizacao.service.mjs';
import atualizacaoRepository from '../repository/index.mjs';

const atualizacaoService = createAtualizacaoService(atualizacaoRepository);

export default atualizacaoService;