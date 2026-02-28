import jwt from 'jsonwebtoken';
import User from '../models/user.mjs';
import Servico from '../models/servico.mjs';

import dotEnv from 'dotenv';
import orgao from '../models/orgao.mjs';
dotEnv.config();

class SessionController {
    async store(req, res) {
        const { documento, password } = req.body;
        try {
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

            const now = new Date();
            const formatedDate = now;
            const formatedTime = now.toLocaleTimeString();
            const body = {
                    rg: user.documento,
                    dataInicio: formatedDate,
                    horaInicio: formatedTime,
            }
            // let servico = null;
            // const isOpenServico = await Servico.findOne({ where: { dataTermino: null}, order: [['created_at', 'DESC']]});
  
            // if (isOpenServico) {
            //     const bodyUpdate = {
            //         dataTermino: formatedDate,
            //         horaTermino: formatedTime,
            //     }
            //     servico = await isOpenServico.update(bodyUpdate);
            // } else {
            //     servico = await Servico.create(body);
            // }

            const payload = {
                id: user.id,
                documento: user.documento,
                role: user.role,
                gradua: user.gradua,
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
        } catch (error) {
            return res.status(401).json({ error: 'Falha na Autenticação!'});
        }
    }

    validate(req, res) {
        return res.json({
            msg: "Ok"
        })
    }
}

export default new SessionController();
