const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const joi = require('@hapi/joi');
const bycrptt = require('bcryptjs');
const schemas = require('../Model/Validation');
const jwt = require('jsonwebtoken');//mmkn adelo secret w info w by3mly token 
const multerr = require('multer');
const nodemailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');
const passport = require('passport');
const google = require('../Google');
//da 3shan ya7wl el form data le haga express yfhmha
const m = multerr();
//validation of input before data base
const schema = joi.object({
    Name: joi.string().min(3).required(),
    Email: joi.string().min(5).required().email(),
    Password: joi.string().min(5).required()
});
router.post('/register', async (req, res) => {
    const newuser = req.body

    // const {error}= schema.validate(newuser)
    //destraction b7dd ana 3wza eh mn el object el kbera el gyaly mn el validationresult
    const { error } = schemas.registerschema(newuser)
    if (error) {
        await res.status(400).send(error.details[0].message);//badreq
    }
    else {
        const existinguser = await User.findOne({ Email: newuser.Email })//hyrg3lyrow
        if (existinguser != null) {
            res.status(400).send('this email already exist ')
        }

        else {
            //hashing password
            const salt = await bycrptt.genSalt(10)//drgt el s3oba
            const hashpassword = await bycrptt.hash(newuser.Password, salt)
            const user = new User({
                Role: 'User',
                Name: newuser.Name,
                Email: newuser.Email,
                Password: hashpassword
            })
            await user.save();
            res.send(user);
        }
    }
});
router.post('/login', m.none(), async (req, res) => {
    const loginuser = req.body;
    //destraction :
    const { error } = schemas.loginschema(loginuser)
    if (error) {
        await res.status(400).send(error.details[0].message);
    }
    else {
        const existingloginuser = await User.findOne({ Email: loginuser.Email })
        if (existingloginuser != null) {
            const passwordvalidation = await bycrptt.compare(loginuser.Password, existingloginuser.Password)
            if (passwordvalidation == true) {
                //json web token b create token  //payload:id,secret:env
                const token = jwt.sign({ id: existingloginuser._id }, process.env.token_secret, { expiresIn: 60 * 20 })
                //  await res.header('auth-token',token).send(existingloginuser)  
                //.cookie mkntsh htshtghl mn gher el cookie parser
                await res.cookie('auth-token', token, { expires: new Date(Date.now() + 3600000) }).send(existingloginuser)
            }
            else {
                res.status(400).send('wrong password')
            }
        }
        else {
            res.status(400).send('this email doesnot exist')
        }
        res.send()
    }
}
)
router.post('/adduserbyadmin', m.none(), async (req, res) => {
    const user = req.body
    //console.log(user.Email)


    const existinguser = await User.findOne({ Email: user.Email })
    if (!existinguser) {
        const salt = await bycrptt.genSalt(10)//drgt el s3oba
        const hashpassword = await bycrptt.hash(user.Password, salt)
        const add = new User({
            Role: 'User',
            Name: 'User',
            Email: user.Email,
            Password: hashpassword
        })
        await add.save();
        res.send(add);
    }
    else {
        await res.status(400).send('this email already exist');
    }
});
router.post('/forgetpassword', async (req, res) => {

    const useremail = req.body;
    const existinguser = await User.findOne({ Email: useremail.Email });
    if (!existinguser) { return res.status(400).send("badrequest") };

    var token = jwt.sign({ _id: existinguser._id }, process.env.token_secret, { expiresIn: 60 * 2 });
    //transporter el shakhs el by3bt el email
    var transporter = nodemailer.createTransport(smtp({ service: 'Gmail', auth: { user: 'noreplyhewy@gmail.com', pass: '2171996a7a' } }));
    let ID = await transporter.sendMail({
        from: 'noreplyhewy@gmail.com',
        to: req.body.Email, subject: 'PasswordReset',
         html: `<a href="http://localhost:5000/account/resetpassword/${token}" >Click Me</a>`
    })
    if (ID.messageId) {
        res.status(200).send('EmailSent');
    }
    else {
        res.status(400).send('error');
    }

})
// param:ter2et b3t data fl url 
router.get('/resetpassword/:token', async (req, res) => {
    const token = req.params.token;

    //  console.log(token);
    try {
        //byrg3ly payload
        const verified = jwt.verify(token, process.env.token_secret);
        //el mafrud en el route dehh btakhodny 3la form feha confirm password w password w submit fa ana lma hagy agher el passord fe rout tanya 7tkhduo w truh beh yghyr el passowrd fl mongo 
        // console.log(verified);
        res.redirect(`http://localhost:4200/user/confirmpassword/${verified._id}`);
    }
    catch (error) {
        res.status(400).send({ html: `<h3>this link expire </h3>` });

    }
})
router.post('/reset', async (req, res) => {
    const data = req.body;
    // console.log(data);
    const existinguser = await User.findOne({ _id: data.ID });
    // console.log(existinguser);
    if (!existinguser) {
        return res.status(400).send('error');
    }
    const salt = await bycrptt.genSalt(10);//drgt el s3oba
    const hashpassword = await bycrptt.hash(data.Password, salt);
    existinguser.Password = hashpassword;

    await existinguser.save();
    //res.setHeader('Content-Type','text/plain').redirect('http://locahost:4200/');
    //res.status(200).redirect('http://localhost:4200/');
    res.status(200).send('Nice');
})
router.get('/loginwithgmail', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {

    const token = jwt.sign({ _id: req.user._id }, process.env.token_secret, { expiresIn: 60 * 2 });
    res.redirect(`http://localhost:4200/user/dashboard/${token}`);



});




module.exports = router;