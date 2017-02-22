var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require("bcrypt-nodejs");

    userSchema = new Schema({
        email: {type: String, required: true},
        password: {type: String, required: true}
    });

userSchema.methods.zaheslujHeslo = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.platneHeslo = function (password) {
    return bcrypt.compareSync(password, this.password);
};

    module.exports = mongoose.model("User", userSchema);
