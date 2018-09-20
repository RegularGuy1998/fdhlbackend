const express = require("express");
const authRouter = express();
const userModel = require("../model/userModel");
const lodash = require('lodash');
const domain = require("../config/domain")
const FacebookStrategy = require('passport-facebook').Strategy;

const passport = require("passport")
authRouter.use((req, res, next) => {
    next();
})
authRouter.post('/login',(req,res) => {
    const { facebookID, name, email, avatarUrl, gender } = req.body
    req.session.user=facebookID;
    userModel.find({facebookID:req.session.user})
        .then(userFound => {
            if(userFound){
                console.log("user ton tai")
                res.status(201).send({ success: 1, userFound })
            }
            else if(!userFound){
                console.log("tao moi")
                userModel.create(
                    { facebookID, name, email, avatarUrl, gender },
                    (err, userCreated) => {
                        if (err) res.status(500).send({ success: 0, err })
                        else res.status(201).send({ success: 1, userCreated })
                    }
                )
            }    
        })
        .catch((err) => res.status(500).send({ success: 0, err }));
});
authRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send({ success: 0, err });
        else res.send({ success: 1, session: req.session });
    })
}) 
authRouter.get('/isLogin',(req,res) => {
    if(req.session.user){
        res.send({success:1,user:req.session.user})
    }
    else res.send({success:0})
     
});

//Taoj session
authRouter.post("/", (req, res) => {
    const { owner, address, phoneNumber, orderList, note } = req.body;
    req.session.order = {
        owner: owner,
        address: address,
        phoneNumber: phoneNumber,
        orderList: orderList,
        note: note
    }
    // console.log(req.session);
    res.send({ success: 1, order: req.session.order })
});
// authRouter.post("/user", (req, res) => {
//     const { user } = req.body;
//     req.session.user = {user}
//     console.log(req.session);
//     res.send({ success: 1, message: "success" })
// });


//Lấy session
// authRouter.get("/", (req, res) => {
//     console.log(req.session);
//     if (lodash.isUndefined(req.session) && lodash.isUndefined(req.session.order)) {
//         res.status(404).send({ success: 0, message: "user not found" });
//     } else {
//         res.send({ success: 1, orderData: req.session.order });
//     }
// });

authRouter.get("/", (req, res) => {
    console.log(req.session);
    if (lodash.isUndefined(req.session) && lodash.isUndefined(req.session.order)) {
        res.status(404).send({ success: 0, message: "user not found" });
    } else {
        res.send({ success: 1, session: req.session });
    }
});
//Thay đổi session
authRouter.put("/", (req, res) => {
    const updateOrder = { address, phoneNumber, orderList, note } = req.body;
    let orderSession = req.session.order;
    for (const key in updateOrder) {
        if (updateOrder[key]) {
            orderSession[key] = updateOrder[key];
        }
    }
    req.session.order = orderSession;
    res.send({ success: 1, session: req.session });
})

//Xóa session
authRouter.delete('/', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send({ success: 0, err });
        else res.send({ success: 1, message: "Remove success" });
    })
})

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================


// authRouter.use(passport.initialize());
// authRouter.use(passport.session());


// authRouter.get("/fb", passport.authenticate('facebook', { scope: ['email'] }));
// // backend.get("/auth/fb/callback",passport.authenticate('facebook',{
// //     failureRedirect:"https://localhost:3000",successRedirect:"https://localhost:3000"
// // }))
// authRouter.get('/logout', function (req, res, next) {
//     console.log('vao logout');
//     req.logout();
//     return res.send('logout ok');
// });

// authRouter.get('/fb/callback', function (req, res, next) {
//     passport.authenticate('facebook', function (err, user, info) {
//         if (err) {
//             console.log('err tai auth/fb/callback');
//             console.log(err);
//             return next({
//                 'err': err
//             });
//         }

//         if (!user) {
//             console.log('no user');
//             return next({
//                 'err': 'nouser'
//             });
//         }

//         req.logIn(user, function (err) {
//             if (err) {
//                 console.log('error in req login');
//                 return res.redirect('/');
//             }
//             console.log(req.session)
//             return res.redirect('https://localhost:3000');
//         });


//     })(req, res, next);
// });

// passport.use(new FacebookStrategy({
//     clientID: "452497568573549",
//     clientSecret: "7562251f160675be7f3d6c1e129cd9dd",
//     callbackURL: domain.domain + "/auth/fb/callback",
//     profileFields: ["email", "displayName", "gender", "picture"],
//     'enableProof': true
// },
//     (accessToken, refreshToken, profile, done) => {
//         // console.log(profile);
//         userModel.findOne({ facebookID: profile._json.id }, (err, user) => {
//             if (err) return done(err);
//             if (user){
//                 console.log("user ton tai")
//                 return done(null, user);
//             } 
//             const neuUser = new userModel({
//                 facebookID: profile._json.id,
//                 name: profile._json.name,
//                 email: profile._json.email,
//                 avatarUrl: profile._json.picture.data.url,
//                 gender: profile._json.gender,
//             })
//             neuUser.save((err) => {
//                 console.log("tao moi user")
//                 return done(null, user)
//             })
//         })
//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user.id)
// })
// passport.deserializeUser((id, done) => {
//     userModel.findOne({ facebookID: id }, (err, user) => {
//         done(null, user);
//     })
// })
module.exports = authRouter;