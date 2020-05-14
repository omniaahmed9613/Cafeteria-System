const joi=require('@hapi/joi');

const registerschema=(newuser)=>{
//hapi joi btt check el errors
  const schema  = joi.object({
    Name:joi.string().min(3).required(),
    Email:joi.string().min(5).required().email(),
    Password:joi.string().min(5).required()
});
return schema.validate(newuser);//validate deh 3shan arbot el schema bl object
}
 const loginschema=(loginuser)=>{
     const login= joi.object({    
    Email:joi.string().min(5).required().email(),
    Password:joi.string().min(5).required()
});
return login.validate(loginuser);
 }

 const productschema=(newproduct)=>{
    const product= joi.object({
     ProductName:joi.string().required(),
     ProductPrice:joi.required()

 })
 return product.validate(newproduct);
 }

 
const resetschema=(resetuser)=>{
    const reset=joi.object({
        Password:joi.string.required(),
        ConfirmPassword:joi.ref('Password')
    })
    return reset.validate(resetuser)
}


 module.exports={
     registerschema:registerschema,
     loginschema:loginschema,
     productschema:productschema
 }


