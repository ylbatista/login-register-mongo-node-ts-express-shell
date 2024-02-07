import { CategoryModel } from "../../data/data-index";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain/domain.index";

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

    async getCategories() {

        try {

            const categories = await CategoryModel.find();
            
            return categories.map( category => ({
                id: category.id,
                name: category.name,
                available: category.available,
            }));

        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }
    }
}