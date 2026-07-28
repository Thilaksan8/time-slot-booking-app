    require("dotenv").config();

    const express= require("express");
    const cors=require('cors');
    const connectDB = require("./config/db");

    const app = express();

    connectDB();

    app.use(cors());
    app.use(express.json());
    
    const PORT= 5000;
    
    app.get("/",(req,res)=>{
        res.send("Server is running 🚀");
    });
    app.post("/booking",(req,res)=>{
        console.log(req.body);
        res.json({
            message:"Booking Received Successfully"
        });
    });
    app.listen(PORT,()=>{
        console.log(`Server started on port ${PORT}`)
    })