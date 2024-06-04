import { recoveryTokensModel } from '../models/recoveryTokens.js';

/**
 * a
 * @param {string} user Email del usuario 
 * @returns 
 */
export async function createPasswordRecoveryToken(user) {
    const DATE_EXTRA = 1000 * 60 * 60 // 1 hour

    const now = Date.now();

    const token = crypto.randomBytes(32).toString('hex');

    let res = await recoveryTokensModel.create({
        expiry: now + DATE_EXTRA,
        user: user,
        token: token
    });

    return res;
}

export async function getUserFromToken(token) {
    const user = recoveryTokensModel.findOne({
        token: token
    });

    return user;
}

/**
 * Borra los tokens de la base de datos en donde el token ya expiro
 */
export async function deleteExpiredTokens() {
    const res = await recoveryTokensModel.deleteMany({
        expiry: { $lt: Date.now() }
    });

    return res
}

export async function deleteToken(token) {
    return await recoveryTokensModel.deleteOne({token: token});
}