import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtGenerator } from "../../config/jwt.adapter";
import { UserModel } from "../../data/data-index";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain/domain.index";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {
    
    //DI
    constructor() {}

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

            const { password, ...userEntity } =  UserEntity.fromObject(user);

            return {
                user: {...userEntity},
                token: 'abcddsf'
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
}