import { response } from "express";
import { isValidObjectId } from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js";

//Establecemos las colecciones válidas para la búsqueda
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

//Creamos el controlador para buscar usuarios
const buscarUsuarios = async ( termino = '', res = response) => {

    //Diferencimos si la búsqueda es por ID o por texto
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] //Si no hay un usuario devuelve un arreglo vacío
        })
    }

    //Si la búsqueda es por texto, creamos una regexp que no sea sensible al "case" o que busque lo que "contiene" el texto
    const regex = new RegExp( termino, 'i');

    //Encontramos el resultado
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });
    res.json({
        results: usuarios
    })
}

//Creamos el buscador para Categorias
const buscarCategorias = async (termino = '', res = response) => {
    //Diferencimos si la búsqueda es por ID o por texto
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({
        $and: [{nombre:regex}, {estado: true}]
    });
    res.json({
        results: categorias
    })
}


//Creamos el controlador para productos
const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto)? [producto] : []
        })
    }
    const regex = new RegExp( termino, 'i');
    const productos = await Producto.find({
        $or: [{nombre: regex}, {descripcion: regex}],
        $and: [{estado: true}]
    }).populate('categoria', 'nombre');
    res.json({
        results: productos
    })
}


//Creamos el controlador general usando un SWITCH
const buscar = ( req, res = response) => {

    //Recuperamos parámetros
    const {coleccion, termino} = req.params;

    //Verificamos que sea una colección válida
    if (!coleccionesPermitidas.includes( coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    //Usamos el controlador para el caso
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
    
        default:
            res.status(500).json({
                msg: 'La búsqueda no está incluida. Comuníquese con Soporte'
            })
            break;
    }

    

}

export {
    buscar
}