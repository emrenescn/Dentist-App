const mongoose=require("mongoose")

const doctorApplicationSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
    },
    specialization:{type:String,required:true},
    bio:{type:String,required:true},
    status:{type:String,enum:["pending","approved","rejected"],default:"pending"},
    createdAt:{type:Date,default:Date.now}
})
module.exports=mongoose.model("DoctorApplication",doctorApplicationSchema)