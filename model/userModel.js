const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    facebookID: String,
    name: String,
    email: String,
    avatarUrl: String,
    gender: String,
    shop: [{type: Schema.Types.ObjectId, ref: 'Shop'}],
    order: [{type: Schema.Types.ObjectId, ref: 'Order'}]
},{
    timestamps: true
})

module.exports = mongoose.model("User", UserSchema);
