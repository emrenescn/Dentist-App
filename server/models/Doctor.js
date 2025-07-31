const mongoose=require('mongoose')

const doctorSchema=new mongoose.Schema({
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
                unique:true
            },
             specialization: { type: String, required: true },
             phone: { type: String },
             bio: { type: String },
             availableTimes: { type: [String] }, // ["10:00", "11:00"]
             isApproved: { type: Boolean, default: false }, // admin onayı gerekebilir
  },
  { timestamps: true }
);
module.exports=mongoose.model('Doctor',doctorSchema)