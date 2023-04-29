import { Router } from "express";
import { check } from "express-validator";
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { coleccionesPermitidas } from "../helpers/db-validators.js";
import { validarArchivoSubir } from "../middlewares/validar-archivo.js";

export const routerUpload = Router();

routerUpload.post("/", validarArchivoSubir, cargarArchivo);

routerUpload.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen) <- Para no usar CLOUDINARY

routerUpload.get('/:coleccion/:id', [    
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)