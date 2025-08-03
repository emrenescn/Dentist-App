//server
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const connectDB = require("./config/DB.JS")
const authRoutes=require("./routes/authRoutes")
const doctorRoutes=require("./routes/doctorRoutes")
const adminRoutes=require("./routes/adminRoutes")
const appointmentRoutes=require("./routes/appointmentRoutes")
require("dotenv").config()
connectDB();//mongo bağlantısını çağırdık 

const app=express();
const PORT=process.env.PORT || 5000;

//Middleware
app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/doctor",doctorRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/appointment",appointmentRoutes)
//test endpoint
app.get('/',(req,res)=>{
    res.send("Diş hekimi sistemi API çalışıyor")
    
})
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});

