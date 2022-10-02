import {response, request} from 'express';

const usuariosGet = (req= request, res = response) => {

    const {q, nombre = 'No name', apikey, page=1, limit=10} = req.query;
    res.json({
      msg: 'get API - controlador',
      q,
      nombre,
      apikey,
      page,
      limit
    })
}

const usuariosPut = (req= request, res = response) => {

    const id = req.params.id;
    res.json({
      msg: 'put API - controlador',
      id
    })
}

const usuariosPost = (req, res = response) => {

    const body = req.body;
    res.json({
      msg: 'post API - controlador',
      body
    })
}

const usuariosDelete = (req, res = response) => {

    const{ id } = req.params;
    res.json({
      msg: 'delete API - controlador'
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
      msg: 'patch API - controlador'
    })
}


export {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}