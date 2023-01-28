import { response } from "express";
// import  Categoria  from '../models/categoria.js'
import  {Categoria}  from '../models/index.js'
import  Usuario  from '../models/usuario.js'

const obtenerCategorias = async (req, res = response) => {

    const{limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
          .populate('usuario', 'nombre')
          .skip(Number(desde))
          .limit(Number(limite))
      ])
      
      res.json({      
        total,
        categorias
      })

}

const obtenerCategoria = async (req, res = response) => {

    try {
        const {id} = req.params;
        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
        res.json(categoria)
        
    } catch (error) {
        console.log(error);
    }

}



const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a grabar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria( data )

    //Guardar en DB
    await categoria.save();
    res.status(201).json(categoria);

}

const actualizarCategoria = async (req, res = response) => {
    try {
        const {id} = req.params;
        const {_id, estado, nombre, usuario} = req.body;

        const categoria = await Categoria.findByIdAndUpdate(id, {
            nombre: nombre.toUpperCase(),
            usuario: req.usuario._id
        }, { new: true}).populate('usuario', 'nombre');

        res.json(categoria);
    } catch (error) {
        console.log(error);
    }
}

const borrarCategoria = async (req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(categoria);
}

export {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}