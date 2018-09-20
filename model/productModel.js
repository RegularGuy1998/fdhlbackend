const mongosee = require("mongoose");
const Schema = mongosee.Schema;

const productSchema = new Schema({
    shopID: {type: Schema.Types.ObjectId, ref: 'Shop'},
    name: {type: String, require: true},
    image: {type: String, require: true},
    price: {type: Number, require: true}
});


module.exports = mongosee.model("Product", productSchema);