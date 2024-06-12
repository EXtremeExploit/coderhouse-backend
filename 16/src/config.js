import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.ENV,

    port: Number(process.env.PORT ?? 8080),
    mongo_url: process.env.MONGO_BD_URL,
    cookies_secret: process.env.COOKIES_SECRET,
    session_secret: process.env.SESSION_SECRET,
    salt: Number(process.env.SALT ?? 12),

    //Nodemailer
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,

    //Github
    gh_client_id: process.env.GH_CLIENT_ID,
    gh_client_secret: process.env.GH_CLIENT_SECRET
}

export default config;
