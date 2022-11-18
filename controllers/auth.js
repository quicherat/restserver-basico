import { response } from "express";
import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";


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
    
    const { id_token } =req.body;

    try {
        
        const {correo, nombre, img} = await googleVerify( id_token);

        let usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            //Si no existe, creamos usuario
            const data = {
                nombre,
                correo,
                password: 'cualquiera', //Valida que el hash sea el correcto
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario está en BD pero bloqueado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
            
        //Generar el JWT
        const token = await generarJWT(usuario.id);
        

        res.json ({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
    
}


export {
    login,
    googleSignIn
}