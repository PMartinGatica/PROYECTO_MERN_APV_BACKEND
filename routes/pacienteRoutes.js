import  express  from "express";
import { agregarPaciente,obtenerPaciente,obtenerPacienteUnico,actualizarPaciente,eliminarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/',checkAuth, agregarPaciente)
router.get('/',checkAuth, obtenerPaciente)

router
    .route('/:id')
    .get(checkAuth, obtenerPacienteUnico)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)


export default router;
