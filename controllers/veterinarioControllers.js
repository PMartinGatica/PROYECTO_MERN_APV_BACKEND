import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar = async (req,res)=>{
    //Prevenir usuarios duplicados
    const {email,nombre} = req.body;
const existeUsuario = await Veterinario.findOne({email});
if (existeUsuario){
    const error = new Error ("Usuario ya registrado");
    return res.status(400).json({msj: error.message})
}
try {
const veterinario = new Veterinario(req.body);
const veterinarioGuarado = await veterinario.save();

//Enviar el email

emailRegistro({
    email,
    nombre,
    token: veterinarioGuarado.token,
})

res.json(veterinarioGuarado);

} catch (error) {
console.log(error) 
} 
}


const perfil = (req,res)=>{
    const {veterinario} = req;
    res.json({perfil : veterinario});
}

const confirmar = async (req,res)=>{
    const {token} = req.params;
    
    const usuarioConfirmar = await Veterinario.findOne({token});

    if (!usuarioConfirmar){
        const error = new Error ("No se encuentra el usuario");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg:"Usuario confirmado correctamente"});

    } catch (error) {
        console.log(error)    
    }

}

const autenticar = async (req, res ) =>{
//Destrocyuring
    const {email,password} = req.body

    //Comprobar si existe el usuario
const usuario = await Veterinario.findOne({email});

if(!usuario){
    const error =  new Error ("El usuario no existe");
    return res.status(404).json({msg:error.message})
}
// res.json({msg : 'Autenticando'});


//Comprobar si el usuario esta confirmado
if(!usuario.confirmado){
    const error = new Error ('Tu cuenta no ha sido confirmado')
    return res.status(403).json({msg:error.message})
}

//Revisar password

if(await usuario.comprobarPassword(password)){
    //Autenticar
res.json({token: generarJWT(usuario.id)});
}else{
    const error = new Error ('El password es incorrecto')
    return res.status(403).json({msg:error.message})
};

};

const olvidePassword = async (req, res) =>{
 const {email} = req.body;
 const existeVeterinario = await Veterinario.findOne({email})
 if(! existeVeterinario) {
    const error = new Error("El usuario no existe")
    return res.status(400).json({msg : error.message})
 }

 try {
    existeVeterinario.token = generarID()
    await existeVeterinario.save();

//enviar email con instrucciones
    emailOlvidePassword({
        email,
        nombre: existeVeterinario.nombre,
        token: existeVeterinario.token
    })

    res.json("Hemos enviado un email con las instrucciones")
 } catch (error) {
    // console.log(error);
 }
};
const comprobarToken =async (req, res) =>{
    const {token} = req.params
    // console.log(token)
    const tokenValido = await Veterinario.findOne({token})
 if(! tokenValido) {
    const error = new Error("Token no valido")
    return res.status(400).json({msg : error.message})
 }else{
    res.json({msg: "Token valido , el usuario existe"})
 }

}
const nuevoPassword = async (req, res) =>{
    const {token} = req.params
    const {password} = req.body
    // console.log(token)
    const veterinario = await Veterinario.findOne({token})
 if(! veterinario) {
    const error = new Error("Hubo un error")
    return res.status(400).json({msg : error.message})
 }
 try {
    veterinario.token=null
    veterinario.password = password
    await veterinario.save();
    res.json({msg:"Password modificado correctamente"});
 } catch (error) {
    console.log(error)
 }

}

export{
    registrar,perfil,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword
}