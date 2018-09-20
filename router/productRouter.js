const express = require('express');
const productRouter = express.Router();
const productModel = require("../model/productModel");


//Lấy thông tin sản phẩm
productRouter.get("/:id", (req, res) => {
    productModel.findById(req.params.id)
        .populate('shopID', 'title description')
        .then(productFound => {
            if(!productFound) res.status(404).send({success: 0, message: 'Product Not Found'})
            else res.send({success: 1, productFound});
        })
        .catch(err => res.status(500).send({success: 0, err}));
})
productRouter.get("/", (req, res) => {
    productModel.find({})
        .populate('shopID', 'title description')
        .then(productFound => {
            if(!productFound) res.status(404).send({success: 0, message: 'Product Not Found'})
            else res.send({success: 1, productFound});
        })
        .catch(err => res.status(500).send({success: 0, err}));
})

//Tạo sản phẩm
productRouter.post("/", (req, res) => {
    const { shopID, name, image, price } = req.body;
    productModel.create({ shopID, name, image, price })
        .then(productCreated => res.send({success: 1, productCreated}))
        .catch(err => res.status(500).send({success: 0, err})
    )
}) 

productRouter.put('/:id', (req, res) => {
    const productUpdate = { name, image, price } = req.body;
    productModel.findById(req.params.id)
        .then(productFound => {
            if (!productFound) {
                res.status(404).send({ success: 0, message: 'User not found' });
            } else {
                for (const key in productFound) {
                    if (productUpdate[key]) {
                        productFound[key] = productUpdate[key];
                    }
                }
                return productFound.save();
            }
        })
        .then(productUpdated => res.send({ success: 1, productUpdated }))
        .catch(err => res.send(500).status({ success: 0, err }));
})


module.exports = productRouter;
