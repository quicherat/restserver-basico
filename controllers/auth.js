import { response } from "express";
import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";


const login = async (req, res= response) => {

    const {correo, password} = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario o el password no son correctos - correo'
            })
        }

        //Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario o el password no son correctos - estado:false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario o el password no son correctos - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id);
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
    
}

const googleSignIn = async (req, res=response) => {
    
    try {
        const { id_token } =req.body;
    
        res.json ({
            msg: 'Todo bien!',
            id_token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
    
}


export {
    login,
    googleSignIn
}