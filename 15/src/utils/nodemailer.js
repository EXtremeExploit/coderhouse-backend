import nodemailer from 'nodemailer';
import config from '../config';

const EMAIL_FROM = config.EMAIL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: config.EMAIL_PASS
    },
});

export async function sendEmail(email, subject, content) {
    const mailOptions = {
        from: EMAIL_FROM,
        to: email,
        subject: subject,
        html: content
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('error al enviar mail')
            debugger;
        } else {
            console.log(`correo enviado: ${info}`);
        }
    })
}