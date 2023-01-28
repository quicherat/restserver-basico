import { response } from "express";
import Producto from '../models/producto.js';
import Categoria from '../models/categoria.js';
import usuario from "../models/usuario.js";
import categoria from "../models/categoria.js";



const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}



const obtenerProducto = async (req, res = response) => {
    try {
        const {id} = req.params;
        const producto = await Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
        
        res.json(producto);

    } catch (error) {
        console.log(error)
    }
}



const crearProducto = async (req, res = response) => {
    //Separamos lo que no VAMOS A UTILIZAR de la información del Body
    const {estado, usuario, ...body} = req.body;

    //Pasamos el nombre a mayúscula
    const nombre = req.body.nombre.toUpperCase();

    //Comprobamos producto NO exista en DB
    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400). json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Comprobamos categoria Exista en DB
    const idCategoria = req.body.categoria;
    const categoriaDB = await Categoria.findById(idCategoria)

    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoría con id: ${ idCategoria}, NO EXISTE`
        });
    }

    //Generamos la data a grabar
    const data = {
        ...body,
        nombre,        
        usuario: req.usuario._id        
    }

    //Creamos una nueva instancia de producto
    const producto = new Producto(data);

    //La guardamos
    await producto.save();

    //Respondemos
    res.status(201). json(producto);
}



const actualizarProducto = async (req, res = response) => {
    try {
        const {id} = req.params;
        const { usuario, estado, ...data} = req.body;

        if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
        }

        data.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true});            

        res.json(producto);

    } catch (error) {
        console.log(error)
    }
}



const borrarProducto = async (req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(producto);
}


export {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}