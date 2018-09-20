const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./router/apiRouter');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
// var FacebookStrategy = require('passport-facebook').Strategy;

const passport=require("passport")
// const passportfb=require("passport-facebook").Strategy
const userModel = require("./model/userModel");
const domain =require("./config/domain")
let backend = express();



backend.use(cors({
    credentials: true,
    origin: true
}))
backend.enable('trust proxy');
backend.use(session({
    secret: 'Nguoi yeu dau hoi~ em mai la mat troiiii',
    resave: false,
    proxy: true,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

backend.use(bodyParser.urlencoded({ extended: false, limit:'10mb' }));
backend.use(bodyParser.json({limit: '10mb'}));
backend.use(passport.initialize());
backend.use(passport.session());

backend.use((req, res, next) => {
   
    next();
})


backend.use('/api', apiRouter);
var authFB = require('./router/auth.fb')(passport);
backend.use('/api', authFB);


let host = 'mongodb://FoodyHoLa:Hola123@ds243212.mlab.com:43212/foodyhoalac';
// let host = 'mongodb://localhost/Project';
mongoose.connect(host, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("mongodb success!")
    }
});

//config https
var fs    = require('fs');
var https = require('https');
var options =
 {
   key:  fs.readFileSync('./privkey.pem'),
   cert: fs.readFileSync('./fullchain.pem')
 };

 var server = https.createServer(options, backend);

 server.listen(process.env.PORT || 8080, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Server is listening with localhost 8080");
    }
})
// passport.serializeUser((user,done)=>{
//     done(null,user.id)
// })
// passport.deserializeUser((id,done)=>{
//     userModel.findOne({facebookID:id},(err,user)=>{
//         done(null,user);
//     })
// })