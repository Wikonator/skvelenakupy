var mongoose = require("mongoose"),
    Schema = mongoose.Schema,

Variant = new Schema({
    productID : {type: String, required: true},
    imagePath : {type: String, required: true},
    thumbPath : {type: String, required: false},
    color : {type: String, required: false}
});

module.exports = mongoose.model("Variant", Variant, "variants");
