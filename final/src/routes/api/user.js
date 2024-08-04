import { Router } from "express";
import { userModel } from "../../models/user.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        const res = [];

        const allowedProps = ['first_name', 'last_name', 'email', 'rol'];

        users.map((u) => {
            let finalUser = {};
            for (const prop of allowedProps) {
                finalUser[prop] = u[allowedProps];
            }
            return finalUser;
        });


        res.status(200).send(users);
    } catch (e) {
        req.logger.error(e);
        res.status(500).send("Error al consultar users: " + e);
    }
});

userRouter.delete('/', async (req, res) => {
    try {
        var dateOffset = (24 * 60 * 60 * 1000) * 2; // 2 days
        var oldDate = new Date();
        oldDate.setTime(oldDate.getTime() - dateOffset);

        const users = await userModel.deleteMany({ last_connection: { $lt: oldDate } });

        res.status(200).send(users);
    } catch (e) {
        req.logger.error(e);
        res.status(500).send("Error al borrar usuarios inactivos: " + e);
    }
});

userRouter.post('/:uid/documents', async (req, res) => {
    try {
        const { uid } = req.params;

        const newDocs = req.body;

        const user = await userModel.findByIdAndUpdate(uid, {
            $push: {
                documents: {
                    $each: newDocs
                }
            }
        }, { new: true });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.status(200).send(user);
    } catch (e) {
        req.logger.error(e);
        res.status(500).send(`Error al consultar docs del usuario: ${e}`);
    }
});

userRouter.get('/premium/:uid', async (req, res) => {
    try {
        if (req.user?.rol != 'Admin')
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
        req.logger.error(e);
        res.status(500).send("Error al actualizar el estado premium de un usuario: " + e);
    }
});

userRouter.delete('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;

        let isUser = false;
        let user = await userModel.findById(uid);
        if (user.email == req.user?.email)
            isUser = true;

        if (isUser || req.user?.rol == 'Admin') {
            const res = await userModel.findByIdAndDelete(uid);
            res.status(200).send(result);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (e) {
        req.logger.error(e);
        res.status(500).send("Error al borrar usuario: " + e);
    }
})

export default userRouter;
