import { corsOptions } from '../../configs/cors-configuration.js';
import Field from './field.model.js';

export const createField = async(request, response)=>{
    try {

        const fieldData = request.body;

        /*if(request.file){
            const extension = request.file.path.split('.').pop();
            const filename = request.file.filename;
            const relativePath = filename.substring(filename.indexOf('fields/'));

            fieldData.photo = `${relativePath}.${extension}`;
        }else{
            fieldData.photo = 'fields/kinal_sports_nyxo5';
        }*/

        const field = new Field(fieldData);
        await field.save();

        response.status(201).json({
            success: true,
            message: 'Campo creado exitosamente',
            data:field
        })

    } catch (error) {
        response.status(400).json({
            success: false,
            message: 'Error al crear el campo',
            error: error.message
        });
    }
}

export const getFields = async(request, response)=>{
    try {
        const {page = 1, limit=10, isActive=true} = request.query;

        const filter ={isActive};
        const option ={
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {createdAt: -1}
        }

        const fields = await Field.find(filter)
            .limit(limit *1)
            .skip((page-1) * limit)
            .sort(corsOptions.sort);

            const total = await Field.countDocuments(filter);

            response.status(200).json({
                success: true,
                data:fields,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total/limit),
                    totalRecords: total,
                    limit
                }
            })

    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Error al obtener los campos',
            error: error.message
        })
    }
}