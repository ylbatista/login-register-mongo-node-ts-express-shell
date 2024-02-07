import { NextFunction, Request, Response } from "express";
import { JwtGenerator } from "../../config/jwt.adapter";
import { UserModel } from "../../data/data-index";
import { UserEntity } from "../../domain/domain.index";


export class AuthMiddleware {
    static async validateJwt( req: Request, res: Response, next: NextFunction ) {

        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtGenerator.validateToken<{ id: string }>(token);
            if ( !payload ) return res.status(401).json({error:'Invalid token'});

            const user = await UserModel.findById( payload.id );
            if ( !user ) return res.status(401).json({ error:'Invalid token - user' });

            //todo: validar si user is active
            req.body.user = UserEntity.fromObject( user );

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}