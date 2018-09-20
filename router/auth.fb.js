module.exports = function (passport) {
    var express = require('express');
    var router = express.Router();
    const FacebookStrategy = require('passport-facebook').Strategy;
    const domain = require("../config/domain")
    const userModel = require("../model/userModel");


    router.get("/auth/fb", passport.authenticate('facebook', { scope: ['email'] }));
    router.get('/auth/logout', function (req, res, next) {
        // console.log('vao logout');
        req.logout();
        usertemp=null;
        return res.redirect('https://localhost:3000');
    });

    router.get('/abc', (req, res) => {
        res.send('abc');
    })

    router.get('/auth/fb/callback', function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            if (err) {
                // console.log('err tai auth/fb/callback');
                console.log(err);
                return next({
                    'err': err
                });
            }

            if (!user) {
                console.log('no user');
                return next({
                    'err': 'nouser'
                });
            }

            req.login(user, function (err) {
                if (err) {
                    console.log('error in req login');
                    return res.redirect('/');
                }
                // console.log(req.session)
                // console.log(req.user)
                req.session.save(function(err){
                    if(err) return res.send("loi")
                    // console.log(req.session)
                    res.json({session: req.session});
                });
                 
            });


        })(req, res, next);
    });
    router.get('/auth/fb/isLogin',function(req,res){
        // console.log("Islogin");
        // console.log(req.session)
    });
    // router.get('/auth/fb/isLogin',checkAuthentication,function(req,res){
    //     //do something only if user is authenticated
    //     console.log("authenticated")
    // });
    function checkAuthentication(req,res,next){
        if(req.isAuthenticated()){
            //req.isAuthenticated() will return true if user is logged in
            next();
        } else{
            console.log("not auth")
        }
    }
    passport.use(new FacebookStrategy({
        clientID: "452497568573549",
        clientSecret: "7562251f160675be7f3d6c1e129cd9dd",
        callbackURL: domain.domain + "/api/auth/fb/callback",
        profileFields: ["email", "displayName", "gender", "picture"],
        'enableProof': true
    },
        (accessToken, refreshToken, profile, done) => {
            // console.log(profile);
            userModel.findOne({ facebookID: profile._json.id }, (err, user) => {
                if (err) return done(err);
                if (user) {
                    console.log("user ton tai")
                    return done(null, user);
                }
                const neuUser = new userModel({
                    facebookID: profile._json.id,
                    name: profile._json.name,
                    email: profile._json.email,
                    avatarUrl: profile._json.picture.data.url,
                    gender: profile._json.gender,
                })
                neuUser.save((err) => {
                    console.log("tao moi user")
                    return done(null, user)
                })
            })
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        userModel.findOne({ facebookID: id }, (err, user) => {
            done(null, user);
        })
    })

    return router;
}