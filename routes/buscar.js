import {Router} from 'express';
import { buscar, buscarPorSubnivel } from '../controllers/buscar.js';

export const routerBuscar = Router();
routerBuscar.get('/:coleccion/:termino', buscar);

export const routerBuscarSub = Router();
routerBuscarSub.get('/:coleccion/:subnivel', buscarPorSubnivel);