import { Router } from 'express';
import { AuthController } from './auth-controller';

import { EmailService, AuthService } from './../services/service.index';
import { envs } from '../../config/envs';





export class AuthRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );

    
    const authService = new AuthService(emailService);

    const controller = new AuthController( authService );

    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    
    router.get('/validate-email/:token', controller.validateEmail /*por url recibo token */ );

    return router;
  }


}

 