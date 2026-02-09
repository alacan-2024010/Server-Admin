'use strict';

import mongoose from "mongoose";

export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', () =>{
            console.log('MongoDB | No se pudo conectar a mongoDB'),
            mongoose.disconnect();
        });

        mongoose.connection.on('connection', () =>{
            console.log('MongoDB | Intentando conectar a mongoDB')
        });

        mongoose.connection.on('connected', () =>{
            console.log('MongoDB | Conectado a mongoDB')
        });

        mongoose.connection.on('open', () =>{
            console.log('MongoDB | Conectado a la base de datos KinalSports')
        });

        mongoose.connection.on('reconnected', () =>{
            console.log('MongoDB | Reconectando a mongoDB')
        });

        mongoose.connection.on('disconnected', () =>{
            console.log('MongoDB | Desconectado a mongoDB')
        });

        await mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        })
    }catch(error){
        console.log(`Error al conectar la db: ${error}`);
    }
}

const gracefulShutdown = async(signal) => {
    console.log(`MongoDB | Received ${signal}. Closing  database connection...`);
    try {
        await mongoose.connection.close();
        console.log('MongoDB | Database connection closed succesfuly');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB | Error during graceful shutdown: ', error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGURS2', () => gracefulShutdown('SIGURS2'));