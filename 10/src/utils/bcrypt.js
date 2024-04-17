import bcrypt from 'bcrypt';

export function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

export function validatePassword(passwordSend, dbPassword) {
    return bcrypt.compareSync(passwordSend, dbPassword);
}
