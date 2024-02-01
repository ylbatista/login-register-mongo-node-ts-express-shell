import { Router } from 'express';
import { AuthController } from './auth-controller';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new AuthController();
    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    
    router.get('/validate-email/:token', controller.validateEmail /*por url recibo token */ );

    return router;
  }


}

