import {Router} from 'express';
import { check } from 'express-validator';
import { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } from '../controllers/productos.js';
import { existeCategoriaPorId, existeProductoPorId } from '../helpers/db-validators.js';
import { esAdminRole, validarCampos, validarJWT } from '../middlewares/index.js';

export const routerProductos = Router();

//Obtenr todos los productos - público
routerProductos.get('/', obtenerProductos);


//Obtener un producto por id - público
routerProductos.get('/:id', [
    check('id', 'No es un Id válido').isMongoId(),
    check('id'). custom(existeProductoPorId),
    validarCampos
], obtenerProducto)



//Crear una nuevo producto - privado - cualquier persona con un token válido
routerProductos.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id de categoría no es válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos    
], crearProducto )



//Actualizar un producto - Privado - cualquier persona con un token válido
routerProductos.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),        
    check('categoria', 'El id de categoría no es válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto);



//Borrar un producto - privado - sólo Admin
routerProductos.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);