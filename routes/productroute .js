const express = require('express');
const router = express.Router();
const ProductSchema = require('../Model/Product');
const productvalidation = require('../Model/Validation');
const jwt = require('./verifytoken');
const multerr = require('multer');
//da 3shan ya7wl el form data le haga express yfhmha
const storagee = multerr.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Imagefolder/')
    }, filename: function (req, file, cb) {
        cb(null, file.originalname)
        //da el name el sora el ha ttsyv 3ndy fl folder
    }
});
const m = multerr({ storage: storagee });
//7o7t hena token 3shan a7my el routes
//.single ya3ny b3tlo file wahed bs 
router.post('/add', m.single('Image'), jwt, async (req, res) => {
    const product = req.body;
    const { error } = productvalidation.productschema(product);
    console.log(error);
    if (error) {
        await res.status(400).send(error.details[0].message);
    }

        let existingproduct = await ProductSchema.findOne({ ProductName: product.ProductName })

        if (!existingproduct) {
            let newproduct = new ProductSchema({
                ProductName: product.ProductName,
                ProductPrice: product.ProductPrice,
                ProductImage: req.file.path
            })
            await newproduct.save();
            res.send(newproduct);
        }
        else { res.status(400).send('this product already exist') }
    
    
})
router.get('/get', async (req, res) => {
    let  getall = await ProductSchema.find();
    await res.status(200).send(getall);
})

 
module.exports = router;