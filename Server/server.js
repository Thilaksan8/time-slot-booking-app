    require("dotenv").config();

    const express= require("express");
    const cors=require('cors');
    const connectDB = require("./config/db");

    const app = express();

    const bookingRoutes = require("./routes/bookingRoute");

    connectDB();

    app.use(cors());
    app.use(express.json());
    app.use("/booking", bookingRoutes);
    
    const PORT= 5000;
 
    
    app.get("/",(req,res)=>{
        res.send("Server is running 🚀");
    });
    
    app.listen(PORT,()=>{
        console.log(`Server started on port ${PORT}`)
    })