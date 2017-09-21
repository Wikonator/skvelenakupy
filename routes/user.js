var express = require('express'),
    router = express.Router(),
    Product = require("../models/product"),
    csrf = require("csurf"),
    passport = require("passport"),
    Cart = require("../models/cart"),
    Order = require("../models/order");

    csrfProtection = csrf();
router.use(csrfProtection);

router.get("/userprofile", jePrihlaseny, function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write("error");
            //dorob sem error handler na express/mongo
        } else {
            var cart;
            orders.forEach(function(order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render("user/userprofile", { orders: orders});
        }
    });
});

router.get("/logout", jePrihlaseny, function(req, res, next) {
    req.logout();
        res.redirect("/");
});

router.use("/", jeOdhlaseny, function(req, res, next) {
    next();
});

router.get("/signup", function (req,res, next) {
    var messages = req.flash("error");
    res.render("user/signup", {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post("/signup", passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true,
}), function(req, res, next) {
    if (req.session.stareUrl) {
        var stareUrl = req.session.stareUrl;
        req.session.stareUrl = null;
        res.redirect(req.session.stareUrl);
    } else {
        res.redirect("/user/userprofile");
    }
});

router.get("/login", function (req, res, next) {
    var messages = req.flash("error");
    res.render("user/login", {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post("/login", passport.authenticate("local.login", {
    failureRedirect: "/user/login",
    failureFlash: true,
}), function(req, res, next) {
    if (req.session.stareUrl) {
        var stareUrl = req.session.stareUrl;
        req.session.stareUrl = null;
        res.redirect(stareUrl);

    } else {
        res.redirect("/user/userprofile");
    }
});

module.exports = router;

function jePrihlaseny(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

function jeOdhlaseny(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}
