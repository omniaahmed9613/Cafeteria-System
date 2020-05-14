const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
    ProductName:{type:String,required:true},
    ProductPrice:{type:Number,required:true},
    ProductImage:{type:String,required:true}
},
{collection:'Product'}
);
module.exports=mongoose.model('Product',ProductSchema,'Product');