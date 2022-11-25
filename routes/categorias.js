import {Router} from 'express';
import { check } from 'express-validator';
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/categorias.js';
import { existeCategoriaPorId} from '../helpers/db-validators.js';
import { validarJWT, validarCampos, esAdminRole } from '../middlewares/index.js';

export const routerCategorias = Router();

//Obtener todas las categorías - público
routerCategorias.get('/', obtenerCategorias);

//Obtener una categoría por id - público
routerCategorias.get('/:id', [
    check('id', 'No es un Id válido').isMongoId(),
    check('id'). custom(existeCategoriaPorId),    
    validarCampos    
], obtenerCategoria);




//Crear una nueva categoría - privado - cualquier persona con un token válido
routerCategorias.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);






//Actualizar una categoría - privado - cualquier persona con un token válido
routerCategorias.put('/:id', [
    validarJWT,
    check('id', 'No es un Id válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar una categoría - privado - sólo Admin
routerCategorias.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);