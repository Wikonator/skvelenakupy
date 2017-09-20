var mongoose = require("mongoose"),
    Schema = mongoose.Schema,


    Product = new Schema({
        imagePath: {type: String, required: true},
        thumbPath: {type: String, required: false},
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        category: {type: String, required: true},
        brand: {type: String, required: false},
        color: {type: String, required: false}
    });


module.exports = mongoose.model("Product", Product, "products");
