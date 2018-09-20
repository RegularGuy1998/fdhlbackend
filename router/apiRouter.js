const express = require("express");
const apiRouter = express();


const shopRouter = require('./shopRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const orderRouter = require('./orderRouter');
const authRouter = require('./authRouter');
const imgurRouter = require('./imgurRouter');


apiRouter.use('/shop', shopRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/product', productRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/uploadfile', imgurRouter);


module.exports = apiRouter;