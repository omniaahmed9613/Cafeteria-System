const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    Role:{type:String,enum:['Admin','User'],required:true},
    Name:{type:String,required:true,min:3,max:255},
    Email:{type:String,required:false,min:5,max:255},
    Password:{type:String,required:false ,min:5,max:1000},
    Date:{type:Date,default:Date.now},
    IdGoogle:{type:String,required:false}
},
{collection:'Users'}
);

module.exports=mongoose.model('user',userschema);





