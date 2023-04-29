import { response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.js";
import { Usuario, Producto } from "../models/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import * as dotenv from 'dotenv';
dotenv.config();
import * as Cloudinary from "cloudinary";
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

//---------------------CARGAR ARCHIVO----------------------------
const cargarArchivo = async (req, res = response) => {
  try {
    //Aplicamos para txt y md; no para imágenes. Creamos la carpeta textos
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
    //Para usar la carpeta img y los tipo default ponemos undefined
    const nombre = await subirArchivo(req.files, undefined, "img");
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

//------------ACTUALIZAR IMAGEN----------------------
const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: `Se me olvidó validar esto`,
      });
  }

  //Limpiar imágenes previas
  try {
    //Vemos si existe la propiedad img en el modelo
    if (modelo.img) {
      //Hay que borrar la imagen del servidor
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      //Preguntamos si existe el archivo, y lo borramos en caso true
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }

  //Subir nueva imagen
  try {
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
  } catch (msg) {
    res.status(400).json({
      msg: `No se pudo guardar la imagen`,
    });
  }

  res.json({ modelo });
};



//------------ACTUALIZAR IMAGEN CLOUDINARY----------------------
const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: `Se me olvidó validar esto`,
      });
  }

  //Limpiar imágenes previas
  try {
    //Vemos si existe la propiedad img en el modelo
    if (modelo.img) {
      //Extraemos el id de la imagen
      const nombreArr = modelo.img.split('/');
      const nombre    = nombreArr[ nombreArr.length - 1 ];
      const [ public_id ] = nombre.split('.');
      await Cloudinary.uploader.destroy( public_id );
    }
  } catch (error) {
    // res.status(500).json({
    //   msg: error,
    // });
  }

  //Subir nueva imagen
  try {
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await Cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
    res.json( modelo );
  } catch (err) {
    res.status(400).json({
      msg: `No se pudo guardar la imagen`      
    });
  }
  // res.json({ modelo });
};

//------------Mostrat Imagen--------------------------
const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: `Se me olvidó validar esto`,
      });
  }

  //Traer la imagen previa
  try {
    //Vemos si existe la propiedad img en el modelo
    if (modelo.img) {
      //Como existe armamos la ruta
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      //Preguntamos si existe el archivo, y lo traemos en caso true
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }

  //Mandamos el no-image
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  //Preguntamos si existe el archivo, y lo traemos en caso true
  if (fs.existsSync(pathImagen)) {
    return res.sendFile(pathImagen);
  }
};

export {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
