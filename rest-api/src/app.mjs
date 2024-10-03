import process from 'process';
import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes.mjs';

import './database/index.mjs';

process.env.TZ = 'America/Sao_Paulo';

class App{
  constructor(){
    this.server = express();

    this.middleware();
    this.routes();
  }

  middleware(){
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes(){
    this.server.use(routes);
    this.server.use(
      '/files',
      express.static(path.resolve(import.meta.dirname,'..','public'))
    );
  }
}

export default new App().server;
