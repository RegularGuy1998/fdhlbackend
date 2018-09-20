const express = require('express');
const imgurRouter = express.Router();
const fs = require('fs');
const imgur = require('imgur')


imgurRouter.post("/", (req, res) => {
    console.log()
    imgur.uploadBase64(req.body.base64)
        .then(resImgur => {
            res.send({success: 1, link: resImgur.data.link})
        })
        .catch(err => res.status(500).send({success: 0, err}))

})

module.exports = imgurRouter;
