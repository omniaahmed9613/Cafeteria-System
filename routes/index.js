const express=require('express');
const router=express.Router();
const verify =require('./verifytoken');


router.get('/',verify,async(req,res)=>res.send('index'));

module.exports=router;
