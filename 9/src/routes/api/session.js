import { Router } from "express";
import { userModel } from "../../models/user.js";
import passport from 'passport';

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).send('Usuario o contraseña no validos')
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            rol: req.user.rol
        }

        res.status(200).redirect("/");
    } catch (e) {
        res.status(500).send("Error al loguear usuario: " + e);
    }
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }

        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
    }

    // try {
    //     const { first_name, last_name, email, password, age } = req.body;
    //     const findUser = await userModel.findOne({ email: email });
    //     if (findUser) {
    //         res.status(400).send("Ya existe un usuario con este mail");
    //     } else {
    //         const isAdmin = email == 'adminCoder@coder.com';
    //         await userModel.create({ first_name, last_name, email, age, password, rol: isAdmin ? "Admin" : "User" });
    //         res.status(200).send("Usuario creado correctamente");
    //     }
    // } catch (e) {
    //     res.status(500).send("Error al registrar users: " + e);
    // }
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e);
        } else {
            res.status(200).redirect("/");
        }
    })
});


sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/');
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }

    })
})


export default sessionRouter;