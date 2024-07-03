import bcrypt from 'bcrypt';
import config from '../config.js';

export function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(config.salt));
}

export function validatePassword(passwordSend, dbPassword) {
    return bcrypt.compareSync(passwordSend, dbPassword);
}
