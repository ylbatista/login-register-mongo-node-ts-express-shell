import mongoose from "mongoose";

interface ConnectionOptions {
    mongoUrl: string;
    dbName: string;
}

export class MongoDbConnection {

    static async connect( options:ConnectionOptions ) {
        const { mongoUrl, dbName } = options;

        try {
            await mongoose.connect( mongoUrl, {
                dbName: dbName,    
            } );
            // comprobar si esta conectado
            console.log('conected with mongoDB');
            
            return true;

        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }
}