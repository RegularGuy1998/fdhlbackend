const express = require("express");
const authRouter = express();
const userModel = require("../model/userModel");
const lodash = require('lodash');
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

module.exports = authRouter;