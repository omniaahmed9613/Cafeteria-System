const express = require('express');
const router = express.Router();
const orderschemaa = require('../Model/Order');
const jwt = require('./verifytoken');//da by check 3l token 
router.post('/send', jwt, async (req, res) => {

    const order = req.body
    let neworder = new orderschemaa({
        Array: order.x,
        UserName: order.UserName
    })
    // console.log(neworder.Array);
    await neworder.save();
    res.send(neworder);
})
router.get('/view', jwt, async (req, res) => {

    var getall = await orderschemaa.find(processing = "processing");
    await res.status(200).send(getall);
})
router.put('/change', jwt, async (req, res) => {

    var order = req.body
    var getbyid = await orderschemaa.findOne({ _id: order.orderid })
    getbyid.processing = "complete";
    await getbyid.save();
    res.status(200).send('done');
    // var getbyid= await orderschemaa.findOne({_id:x});
    // getbyid.processing="complete";
    // await getbyid.save();
    // res.status(200).send('done');
})
module.exports = router;