import { Router } from "express";
import passport from 'passport';
import { createPasswordRecoveryToken, deleteToken, getUserFromToken } from "../../controllers/recoveryTokens.js";
import { userModel } from "../../models/user.js";
import config from "../../config.js";
import { createHash, validatePassword } from "../../utils/bcrypt.js";
import { sendEmail } from "../../utils/nodemailer.js";

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Usuario o contraseña no validos')
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            rol: req.user.rol,
            cartId: req.user.cartId
        }

        res.status(200).redirect("/");
    } catch (e) {
        req.logger.error(e);
        res.status(500).send("Error al loguear usuario: " + e);
    }
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion");
        }

        res.status(200).send("Usuario creado correctamente");

    } catch (e) {
        req.logger.error(e);
        res.status(500).send("Error al registrar usuario");
    }
});

sessionRouter.get('/logout', async (req, res) => {
    if (req.user?.email) {
        const user = await userModel.findOne({ email: req.user.email });
        user.last_connection = new Date()
        await user.save();
    }
    req.session.destroy(function (e) {
        if (e) {
            req.logger.error(e);
        } else {
            res.status(200).redirect("/");
        }
    })
});


sessionRouter.get('/destroy', async (req, res) => {
    await userModel.deleteOne({ email: req.user?.email });
    res.send('Usuario borrado');
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/');
})

sessionRouter.get('/current', async (req, res) => {
    if (!req.user) {
        res.send('Not logged in');
    } else {
        delete req.user.password;
        res.send({
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            cartId: req.user.cartId
        });
    }
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            req.logger.error(e);
        } else {
            res.status(200).redirect("/")
        }
    })
});

sessionRouter.post('/passwordRecovery', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email: email });
        if (!user)
            res.status(400).send(`Usuario con mail "${email}" no encontrado`);

        let res = await createPasswordRecoveryToken(user.email);

        const token = res.token;

        const html = '<p>Haga click en el link para cambiar su contraseña:</p>' +
            `<a href="http://localhost:${config.PORT}/api/session/passwordRecovery/${token}"></a>`

        await await sendEmail(user.email, 'Restablecer contraseña', html);

        res.send(200).send(`Mail enviado a ${user.email}`);
    } catch (e) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al resetear contraseña: ${error}`)
    }
})

sessionRouter.post('/passwordRecovery/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const email = getUserFromToken(token);
        if (!email) { // Token invalido
            res.redirect('../');
        }

        const user = await userModel.findOne({ email: email });
        if (!user) { // Me muero si pasa esto
            res.redirect('../');
            await deleteToken(token);
            return;
        }
        const areEqual = validatePassword(newPassword, user.password);
        if (areEqual) {
            res.status(400).send('La contraseña igual no puede ser igual a la anterior. Vuelve a generar otro link de recuperacion');
            await deleteToken(token);

            return;
        }

        const newPassHash = createHash(newPassword);

        user.password = newPassHash;
        await user.save();

        await deleteToken(token);

    } catch (e) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al resetear contraseña: ${error}`)
    }
});

export default sessionRouter;