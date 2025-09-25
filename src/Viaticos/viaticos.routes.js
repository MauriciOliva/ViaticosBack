import { Router } from "express";
import { 
  obtenerViaticos, 
  createViaticos, 
  obtenerViaticoPorId,
  actualizarViatico,
  eliminarViatico,
  eliminarFotoViatico
} from "./viaticos.controller.js"
import { uploadViaticosPictures } from "../../middleware/multer.uploads.js";
import { handleMulterError } from "../../middleware/multerErrorHandler.js"
import { validateJwt } from "../../middleware/validate.jwt.js";

const router = Router();

router.get('/', obtenerViaticos);
router.get('/:id', obtenerViaticoPorId);

router.post('/create', validateJwt, uploadViaticosPictures.array('foto', 5), handleMulterError, createViaticos);
router.put('/:id', validateJwt, uploadViaticosPictures.array('foto', 5), handleMulterError, actualizarViatico);
router.delete('/:id', validateJwt, eliminarViatico);
router.delete('/:id/fotos/:fotoIndex', validateJwt, eliminarFotoViatico);

export default router;