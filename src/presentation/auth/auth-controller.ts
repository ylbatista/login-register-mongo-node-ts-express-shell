//controlador encargado de dar la respuesta al cliente

import { Response, Request } from "express";

 

export class AuthController {
    //DI dependency injections 

    constructor() {}

    registerUser = (req: Request, res: Response) => {
        res.json('registerUser');
    }

    loginUser = (req: Request, res: Response) => {
        res.json('loginUser');
    }

    validateEmail = (req: Request, res: Response) => {
        res.json('validateEmail');
    }
}