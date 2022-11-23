
import express from 'express';
import { dbConnection } from '../database/config.js';
import cors from 'cors';

import {router} from '../routes/usuarios.js'
import {routerAuth} from '../routes/auth.js'
import { routerCategorias } from '../routes/categorias.js';

export class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias'
    }

    //Conectar a DB
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {

    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.categorias, routerCategorias);    
    this.app.use(this.paths.auth, routerAuth);    
    this.app.use(this.paths.usuarios, router);    
  }

  listen() {
    this.app.listen( this.port, () => {
        console.log('Servidor corriendo en puerto', this.port);
    })
  }
}
