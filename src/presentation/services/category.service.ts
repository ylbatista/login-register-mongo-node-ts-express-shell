import { CategoryModel } from "../../data/data-index";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain/domain.index";

export class CategoryService {
    //DI 
    constructor(){}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ){

        const categoryExists = await CategoryModel.findOne({ name: CreateCategoryDto.name });
        if( categoryExists ) throw CustomError.badRequest( 'Category already exist' );

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            })
            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available,
            }

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }
    };

    
    async getCategories( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {
            // para saber cual es el total de la paginacion
            // const total = await CategoryModel.countDocuments();
            // haciendo la paginacion
            // const categories = await CategoryModel.find()
                // .skip( (page - 1) * limit ) //pagina 2
                // .limit( limit )

            const [total, categories] = await Promise.all( [
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip( ( page - 1 ) * limit )
                    .limit( limit )
            ] );

            return {
                
                categories: categories.map( category => ({

                    id: category.id,
                    name: category.name,
                    available: category.available,
                })),

                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/categories?page=${ ( page - 1 ) }&limit=${ limit }`: null,

            }   

        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }
    }
}