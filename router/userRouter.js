const express = require('express');
const userRouter = express.Router();
const userModel = require("../model/userModel");

//Lấy thông tin người dùng
userRouter.get("/:userIdfb", (req, res) => {
    userModel.find({facebookID:req.params.userIdfb}, (err, user) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, user })
    })
}) 


userRouter.get("/info/:id", (req, res) => {
    console.log(req.params.id)
    userModel.findById(req.params.id, (err, user) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, user })
    })
}) 

//Lấy thông tin các shop của người dùng
userRouter.get("/:userId/shop", (req, res) => {
    userModel.findById(req.params.userId)
        .populate('shop')
        .exec((err, user) => {
            if (err) res.status(500).send({ success: 0, err })
            else {
                let shop = user.shop;
                res.send({ success: 1, shop })
            }
        })
})
//Lấy thông tin các sản phẩm đã order
userRouter.get("/:userId/order", (req, res) => {
    userModel.findById(req.params.userId)
        .populate('order') 
        .exec((err, user) => {
            if (err) res.status(500).send({ success: 0, err })
            else {
                let order = user.order;
                res.send({ success: 1, order })
            }
        })
})

//Cập nhật thông tin người dùng
userRouter.put('/:userId', (req, res) => {
    const userUpdate = { name, email, avatarUrl, gender, shop, order } = req.body;
    userModel.findById(req.params.userId)
        .then(userFound => {
            if (!userFound) {
                res.status(404).send({ success: 0, message: 'User not found' });
            } else {
                for (const key in userFound) {
                    if (userUpdate[key]) {
                        userFound[key] = userUpdate[key];
                    }
                }
                return userFound.save();
            }
        })
        .then(userUpdated => res.send({ success: 1, userUpdated }))
        .catch(err => res.send(500).status({ success: 0, err }));
})


//Lấy tất cả User
userRouter.get('/', (req,res) => {
    console.log('aaaa')
    userModel.find({})
        .then(userFound => {
            res.status(201).send({ success: 1, userFound })
        })
        .catch((err) => res.status(500).send({ success: 0, err }));
})


//Tạo thông tin người dùng
userRouter.post("/", (req, res) => {
    const { facebookID, name, email, avatarUrl, gender } = req.body;
    userModel.create(
        { facebookID, name, email, avatarUrl, gender },
        (err, userCreated) => {
            if (err) res.status(500).send({ success: 0, err })
            else res.status(201).send({ success: 1, userCreated })
        }
    )
})

module.exports = userRouter;
