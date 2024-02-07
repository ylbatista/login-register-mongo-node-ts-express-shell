
import mongoose, { Schema } from "mongoose";

//Schema, reglas de como queremos grabar la informacion
//schema se importa de mongoose

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },

    available: {
        type: Boolean,
        default: false,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});

export const CategoryModel = mongoose.model('Category', categorySchema);