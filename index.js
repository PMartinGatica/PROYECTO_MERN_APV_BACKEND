import express from "express";
import dotenv from 'dotenv';
import conectarBD from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'
import cors from "cors";

const app = express();
app.use(express.json())
dotenv.config();

conectarBD();

const dominiosPermitidos = ['http://localhost:5173']

const corsOptions = {
    origin: function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origgen del reqest esta permitido
            callback(null, true)
        }else {
            callback(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOptions))
app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacienteRoutes);
    

const PORT = process.env.PORT || 4000;
app.listen(PORT,( )=>{
    console.log(`servidor funcionando en el puerto ${PORT}`);
})