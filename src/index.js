// import mongoose from "mongoose"
// import {DB_NAME} from "./constants."
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});
import connectDB from "./db/indexdb.js"


connectDB()








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