import express from "express";
import { dbConnection } from "../database/config.js";
import cors from "cors";

import { router } from "../routes/usuarios.js";
import { routerAuth } from "../routes/auth.js";
import { routerCategorias } from "../routes/categorias.js";
import { routerProductos } from "../routes/productos.js";
import { routerBuscar, routerBuscarSub } from "../routes/buscar.js";
import { routerUpload } from "../routes/uploads.js";
import fileUpload from "express-fileupload";

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      buscarSub: "/api/buscarSub",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
    };

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
    this.app.use(express.static("public"));

    //Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.buscar, routerBuscar);
    this.app.use(this.paths.buscarSub, routerBuscarSub);
    this.app.use(this.paths.categorias, routerCategorias);
    this.app.use(this.paths.productos, routerProductos);
    this.app.use(this.paths.usuarios, router);
    this.app.use(this.paths.uploads, routerUpload);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}
