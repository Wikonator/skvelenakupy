var mongoose = require("mongoose"),
    Schema = mongoose.Schema,


    schema = new Schema({
        user: {type: Schema.Types.ObjectId, ref: "pouzivatel", required: false},
        cart: {type: Object, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        ulica: {type: String, required: true},
        cislo: {type: Number, required: true},
        mesto: {type: String, required: true},
        PSC: {type: Number, required: true},
        transactionId: {type: String, required: true}
    });


module.exports = mongoose.model("Order", schema);
