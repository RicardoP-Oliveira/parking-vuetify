import { Router } from "express";
import multer from 'multer';
import atualizacaoController from '../controller/index.mjs';

const routes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 2,
    fileSize: 15 * 1024 * 1024
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      return callback(new Error('Envie some arquivos CSV.'))
    }

    callback(null, true)
  }
})

routes.get('/', atualizacaoController.index);
routes.post('/importar', upload.array('arquivos', 2), atualizacaoController.configure)

export default routes;