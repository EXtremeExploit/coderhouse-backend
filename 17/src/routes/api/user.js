import { Router } from "express";
import { userModel } from "../../models/user.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (e) {
        req.error(e);
        res.status(500).send("Error al consultar users: " + e);
    }
});

userRouter.get('/premium/:uid', async (req, res) => {
    try {
        if(req.user?.rol != 'Admin')
            res.status(403).send('No autorizado');


        const { uid } = req.params;
        const user = await userModel.findById(uid);
        if (!user) {
            throw `User ${uid} not found`;
        }

        switch (user.rol) {
            case 'User': user.rol = 'Premium'; break;
            case 'Premium': user.rol = 'User'; break;
            case 'Admin': user.rol = 'Admin'; break;
        }

        await user.save();
        res.send(`Usuario "${uid}" actualizado a ${user.rol}`);
    } catch (e) {
        req.error(e);
        res.status(500).send("Error al actualizar el estado premium de un usuario: " + e);
    }
})

export default userRouter;
