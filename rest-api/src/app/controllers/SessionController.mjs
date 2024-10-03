import jwt from 'jsonwebtoken';
import User from '../models/user.mjs';

import dotEnv from 'dotenv';
import orgao from '../models/orgao.mjs';
dotEnv.config();

class SessionController {
    async store(req, res) {
        const { documento, password } = req.body;

        const user = await User.findOne({ where: { documento },
        include:[
            {
                model: orgao,
                as: 'orgaoU',
            }
        ]
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não existe.'});
        }

        if(!(await user.checkPassword(password))){
            return res.status(401).json({ error: 'Usuário/Senha incorretos.'});
        }

        const payload = {
            id: user.id,
            documento: user.documento,
            role: user.role,
            nGuerra: user.nGuerra,
            orgao: user.orgaoU.sigla,
            isLoggedin: true
        }

        const secret = process.env.SECRET;
        const options = {
            expiresIn: (24*60*60+15*60),
        } 

        return res.json ({
            token: jwt.sign(payload, secret, options)
        });

    }

    validate(req, res) {
        return res.json({
            msg: "Ok"
        })
    }
}

export default new SessionController();
