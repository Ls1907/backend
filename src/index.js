// import mongoose from "mongoose"
// import {DB_NAME} from "./constants."
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
});
import connectDB from "./db/indexdb.js"


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server listening on port ${process.env.PORT}`)
    });
}
    
)
.catch((err)=>{
    console.log("mongodb connection failed")

})








/*
import express from "express"

const app = express()

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERR:",error);
            throw error
        })

        app.listen(process.env.port,()=>{
            console.log(`app is listening on PORT:${process.env.port}`)
        })
        
    } catch (error) {
        console.error("ERROR:",error)
        throw error
    }


})()//IIFE..*/