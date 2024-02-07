


export class CreateCategoryDto {

    private constructor (
        private readonly name: string,
        private readonly available: boolean,
    ){}

    static create( object: { [key: string]:any } ):[ string?, CreateCategoryDto? ] {
        const { name, available = false } = object;
        let availableBoolean = available;

        if ( !name ) return ['Missing name'];
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' )
        }

        return [undefined, new CreateCategoryDto(name, availableBoolean)];
    }



}