import express from 'express'
import { perfil, registrar,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword} from '../controllers/veterinarioControllers.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();
//Area publica
router.post('/' , registrar )
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

// las dos ultimas lineas es lo mismo que poner
// router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Area privada
router.get('/perfil',checkAuth, perfil)


export default router;