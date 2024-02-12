import { Validators } from "../../../config/validators";

export class CreateProductDto {

    private constructor (
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,     // ID
        public readonly category: string, // ID
    ){}

    static create( props: { [key: string]:any } ): [ string?, CreateProductDto? ] {
       
       const { 
            name,
            available,
            price,
            description,
            user,
            category,
        } = props;

        // console.log('CREATE-PRODUCT.DTO.TS, props:', props );
        

       if( !name ) return ['Missing name'];
        
       if( !user ) return ['Missing user'];
       if( !Validators.isMongoID(user) ) return ['Invalid user ID'];

      if( !category ) return ['Missing category'];
      if( !Validators.isMongoID(category) ) return ['Invalid user category'];

        return [
            undefined,
            new CreateProductDto(
                name,
                !!available,
                price,
                description,
                user,
                category,
            )
        ];
    }
}