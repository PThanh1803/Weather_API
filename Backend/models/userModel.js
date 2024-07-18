import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required:true 
    },
    email: { 
        type:String , 
        required : true,
         unique: true
    },
    password: { 
        type:String ,
         required : true
    },
    location: {
        type: String,
        default:"",
        required: true
    },
    announcement:{
        type: Boolean,
        default: false,
        required: true
},
}, {minimize:false});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;