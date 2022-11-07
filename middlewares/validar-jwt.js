import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.js';


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        console.log(token);
        return res.status(401). json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
         const usuario = await Usuario.findById(uid);

         //Si el usuario no existe
         if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la BD'
            })
         }

         //Verificar si el uid tienen estado true
         if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - estado: false'
            })
         }
         
         req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no válido'
        })
        
    }
}


export {
    validarJWT
}