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
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["pending", "approved", "rejected", "cancelled"],
            default:"pending"
        }

},{timestamps:true});
module.exports=moongose.model('Appointment',appointmentSchema)