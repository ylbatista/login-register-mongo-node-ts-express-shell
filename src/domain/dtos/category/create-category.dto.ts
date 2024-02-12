


export class CreateCategoryDto {

    private constructor (
        public readonly name: string,
        private readonly available: boolean,
    ){}

    static create( props: { [key: string]:any } ):[ string?, CreateCategoryDto? ] {
        const { name, available = false } = props;
        let availableBoolean = available;

        if ( !name ) return ['Missing name'];
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' )
        }

        return [undefined, new CreateCategoryDto(name, availableBoolean)];
    }

}