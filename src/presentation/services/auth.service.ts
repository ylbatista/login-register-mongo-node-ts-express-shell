import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { JwtGenerator } from "../../config/jwt.adapter";
import { UserModel } from "../../data/data-index";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain/domain.index";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
    
    //DI
    constructor(
        //inyeccion de dep del service
        private readonly emailService: EmailService,
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if( existUser ) throw CustomError.badRequest('Email already exist');

        try{

            const user = new UserModel(registerUserDto);
            
            //Encriptar password
            user.password = bcryptAdapter.hash( registerUserDto.password );         
            await user.save();

            //JWT para mantener la autenticacion del user
            


            //Enviar email de confirmacion
            await this.sendEmailValidationLink( user.email );

            
            const { password, ...userEntity } =  UserEntity.fromObject(user);

            //hago generacion de jwt
            const token = await JwtGenerator.generateToken({ id: user.id });
            if( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token,
            };

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

        return 'Todo ok!'
    }

    public async loginUser( loginUserDto: LoginUserDto ) {

        //Fineone a ver si un usuario existe
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if( !user ) throw CustomError.badRequest('Email not exist');

        // isMatch.. con el bcrypt compare
        const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
        if( !isMatching ) throw CustomError.badRequest('Password is not valid');

        const { password, ...userEntity } = UserEntity.fromObject( user );

        //hago generacion de jwt
        const token = await JwtGenerator.generateToken({ id: user.id, email: user.email });
        if( !token ) throw CustomError.internalServer('Error while creating JWT')

        return {
            user: {...userEntity},
            token: token,
        }
    }

    private sendEmailValidationLink = async( email: string ) => {
        //genero token 
        const token = await JwtGenerator.generateToken( { email } );
        if( !token ) throw CustomError.internalServer('Error getting token');
        //envio token generado
        const link = `${ envs.WEB_SERVICE_URL }/auth/validate-email/${ token }`;

        const html = `
            <h1> Validate your Email </h1>
            <p> Click on the following link to validate your email </p>
            <a href="${ link }"> Validate your email: ${ email } </a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if( !isSent ) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async ( token:string ) => {

        const payload = await JwtGenerator.validateToken(token);
        if ( !payload ) throw CustomError.unauthorized('Invalid Token');

        const { email } = payload as { email:string };
        if ( !email ) throw CustomError.internalServer('Email not in token');

        //obetengo el usuario de la base de datos
        const user = await UserModel.findOne( { email } );
        if (!user) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();

        return true;
    }
}