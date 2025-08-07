const moongose=require('mongoose')

const appointmentSchema=new moongose.Schema({
        patient:{
            type:moongose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        doctor:{
            type:moongose.Schema.Types.ObjectId,
            ref:"Doctor",
            required:true
        },
        date:{
            type:String,  //YYYY-MM-DD şeklinde format
            required:true
        },
        time:{
            type:String,
            required:true //zaman [11:00] formatında
        },
        status:{
            type:String,
            enum:["pending", "approved", "rejected", "cancelled"],
            default:"pending"
        }

},{timestamps:true});
module.exports=moongose.model('Appointment',appointmentSchema)