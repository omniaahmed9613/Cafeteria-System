const express = require('express');//mas2ol 3n web app
const app = express();
//middle ware req wl res by3o 3lejh awel haga

//3shan a3rf ab3t w ast2bl object (middleware)
app.use(express.json());

const mongoose = require('mongoose');
//3shan el backend yaklm el front end el hwa el url btta3o 4200,credentials3shan 2sm7 lel serve yb3t cookie lel front end
const cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
//cookieparser:package 3shan n3rf nb3t cookie
const cookieparser = require('cookie-parser');
app.use(cookieparser())
//port
const port = process.env.port || 5000;

//env
const env = require('dotenv');
env.config();

//shelto 3shan e7na msh b3ten header feha token e7na b3tna cookie app.use(cors({exposedHeaders:['exposed']}))
//credentials deh 3shan cookie bt2olo argok khode cookie deh 7otha 3ndk



//import the index.js in app
app.use('/', require('./routes/index'));
//import the account.js in adpp
app.use('/account', require('./routes/account'));
//import the productroute
// app.use('/proudct',require('./routes/productroute '));
app.use('/product', require('./routes/productroute '));
//import order route
app.use('/order', require('./routes/order'));
////////////////static btkhleny akhosh 3l route bta3 el images hygbhaly 3ady ////////////////////////////////////////
app.use('/Imagefolder',express.static('Imagefolder'))//mmkn yokhosh 3l folder ygeb el hwa 3wzo 3la tol
// /Imagefolder :deh bnkhleha ytghada 3nha 
//connect to mongo 
mongoose.connect(process.env.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Mongo DB Connected...'))
    .catch((err) => console.log(err));
//hapi/joi by check 3la errors 
app.listen(port, console.log(`server started on ${port}`));