import { Router } from 'express';
import { uploadDocs, uploadProds, uploadProfiles } from '../../config/multer.js';


function insertImg(req, res) {
    try {
        res.status(200).send("Imagen cargada correctamente");
    } catch (error) {
        res.status(500).send("Error al cargar imagen");
    }
}

const multerRouter = Router();

multerRouter.post('/docs', uploadDocs.single('doc'), insertImg);
multerRouter.post('/products', uploadProds.single('product'), insertImg);
multerRouter.post('/profiles', uploadProfiles.single('profile'), insertImg);

export default multerRouter;

