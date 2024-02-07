 //controlador encargado de dar la respuesta al cliente

import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain/domain.index";
import { AuthService } from "../services/auth.service";
import { CategoryService } from "../services/category.service";
 

export class CategoryController {
    //DI dependency injections 
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    private handleError = (error: unknown, res: Response ) => { 
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    createCategory = ( req: Request, res: Response ) => {
        const [error, createCategoryDto] = CreateCategoryDto.create( req.body );
        if ( error ) return res.status(400).json( { error } );
        
        this.categoryService.createCategory(createCategoryDto!, req.body.user )
            .then( category => res.status(201).json( category ))
            .catch( error => this.handleError( error, res ) );
    };

    getCategories = async( req: Request, res: Response ) => {
        this.categoryService.getCategories()
            .then( categories => res.json( categories ))
            .catch( error => this.handleError( error, res ) );
    };
} 