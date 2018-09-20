const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' }, 
    content: { type: String, require: true }
}, {
    timestamps: true
});

const shopSchema = new Schema({

    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, require: true },
    description: { type: String },
    openOrClose: { type: Boolean, default: false },
    comments: [commentsSchema],
    productList: [{type: Schema.Types.ObjectId, ref: 'Product'} ],
    listOrder: [{type: Schema.Types.ObjectId, ref: "Order"}],
}, {
    timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);