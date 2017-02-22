var passport = require("passport"),
    User = require("../models/pouzivatel"),
    LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use("local.signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody("email", "Neplatny email").notEmpty().isEmail();
    req.checkBody("password", "Neplatne heslo").notEmpty().isLength({min:6});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
    }
    User.findOne({"email": email}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: "E-mail uz je obsadeny"});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.zaheslujHeslo(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use("local.login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody("email", "Neplatny email").notEmpty().isEmail();
    req.checkBody("password", "Neplatne heslo").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
    }
    User.findOne({"email": email}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: "Taky pouzivatel neexistuje"});
        }
        if (!user.platneHeslo(password)) {
            return done(null, false, {message: "Nespravne Heslo"});
        }
        if (user.email == "mamadmin@gmail.com") {
            console.log(user);
            req.session.admin = true;
            console.log(req.session.admin);
            return done(null, user);
        } else {
            console.log("nothing on passport fired, moving on");
            return done(null, user);
        }
        });
}));
