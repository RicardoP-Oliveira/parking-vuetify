import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotEnv from 'dotenv';

dotEnv.config();

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ msg: 'Acesso negado!' });
    }

    try {
        const secret = process.env.SECRET;
        // const decoded = await promisify(jwt.verify)(token, secret);
        // console.log(decoded)
        return next();
    } catch(err) {
        return res.status(401).json({ message: 'Falha na Autenticação!'});
    }
}
