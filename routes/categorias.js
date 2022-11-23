import {Router} from 'express';
import { check } from 'express-validator';
import { crearCategoria } from '../controllers/categorias.js';
import { validarJWT, validarCampos } from '../middlewares/index.js';

export const routerCategorias = Router();

//Obtener todas las categorías - público
routerCategorias.get('/', (req, res) => {
    res.json('get')
});

//Obtener una categoría por id - público
routerCategorias.get('/:id', (req, res) => {
    res.json('get - id')
});




//Crear una nueva categoría - privado - cualquier persona con un token válido
routerCategorias.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);






//Actualizar una categoría - privado - cualquier persona con un token válido
routerCategorias.put('/:id', (req, res) => {
    res.json('put')
});

//Borrar una categoría - privado - sólo Admin
routerCategorias.delete('/:id', (req, res) => {
    res.json('delete - put')
});