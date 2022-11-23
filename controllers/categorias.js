import { response } from "express";
import  Categoria  from '../models/categoria.js'



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

export {
    crearCategoria
}