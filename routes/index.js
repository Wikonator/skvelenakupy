var express = require('express'),
    router = express.Router(),
    Product = require("../models/product"),
    Variant = require("../models/variant"),
    mongoose = require("mongoose"),
    util = require('util'),
    braintree = require('braintree'),
    Cart = require("../models/cart"),
    Order = require("../models/order"),
    nodemailer = require('nodemailer'),
    //config is where all the keys are
    config = require("../models/config"),
    mg = require("nodemailer-mailgun-transport"),
    fs = require("fs"),
    https = require("https");

/* GET home page. */
var gateway = braintree.connect({
 environment: braintree.Environment.Sandbox,
 merchantId: config.brainMerchantId,
 publicKey: config.brainPublicKey,
 privateKey: config.brainPrivateKey
});

var mejlautor = {
  auth: {
    api_key: config.mailerApiKey,
    domain: 'deborahmilano.sk'
  }
};
var nodemailerMailgun = nodemailer.createTransport(mg(mejlautor));

router.get("/", function(req, res, next) {
    res.render("shop/home");
});

router.get("/search", function(req, res, next) {
    var products = Product.find({}, null, {sort: {_id: -1}},function (err, docs) {
      if (err) {
        console.log(err);
      } else {
          var productChunks = [];
          var chunkSize = 3;
          for (var i=0; i < docs.length; i += chunkSize) {
              productChunks.push(docs.slice(i, i+ chunkSize));
          }
        res.render('shop/index', { title: 'Deborah Milano', products: productChunks });
        }
    });
});

router.post("/search", function (req, res, next) {
    var query = Product.find()
    console.log(req.body);
    var searchString = req.body.search;
    var products = Product.find({"$text": {"$search":"'"+ searchString + "'" }}, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
            var productChunks = [];
            var chunkSize = 3;
            for (var i=0; i < docs.length; i += chunkSize) {
                productChunks.push(docs.slice(i, i+ chunkSize));
            }
            res.render('shop/index', { title: 'Deborah Milano', products: productChunks });
          }
    });
});

router.get("/add-to-cart/:id", function (req, res, next) {
    var productId = req.params.id,
        cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect("shop/home");
            //THIS NEEDS TO SHOW ERROR AND / or REDIRECT
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/");
    });
});

router.get("/odoberJednu/:id", function (req, res, next) {
    var id = req.params.id,
        cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.odoberJednu(id);
        req.session.cart = cart;
        res.redirect("/kosik");
});

router.get("/odoberVsetky/:id", function (req, res, next) {
    var id = req.params.id,
        cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.odoberVsetky(id);
        req.session.cart = cart;
        res.redirect("/kosik");
});


router.get("/itemView/:id", function(req, res, next) {
    var productResults = {};
    var string = req.params.id;
    Product.find({"_id" : string }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            productResults = docs[0];
        Variant.find({"productID" : string} , function(e, variantResults) {
            if (e) {
                console.log(e);
            }
            else {
                var expressObject = {
                    "productResults" : productResults,
                    "variantResults" : variantResults
                };
                console.log(expressObject);
                res.render("shop/itemView", expressObject);
            }
        });
        }
    });
});

router.get("/variant-add/:id", function (req, res, next) {
    var productID = req.params.id;
    console.log(productID);
    res.render("user/variant", {prodID: productID});
});


router.get("/admin",
// jeAdmin,
  function(req, res, next){
    res.render("user/admin");
});

var cpUpload = upload.fields([{ name: 'InputFile', maxCount: 1 }, { name: 'thumbFile', maxCount: 1 }]);
router.post("/variant-pridaj", cpUpload, function (req, res, next) {
    var prodIdString = req.body.productID.toString()
    // console.log(req.files);
    var mongoObject = new Variant({
        productID : prodIdString,
        imagePath : "/images/produkty/" + req.files['InputFile'][0].filename,
        thumbPath : "/images/produkty/" + req.files['thumbFile'][0].filename,
        color : req.body.nazov
    });
    if (req.files) {
        console.log("if on upload fired");
        console.log(mongoObject);
        mongoObject.save(function(err, result) {
            if (err) {
                console.log("neco sa dojebalo");
                console.log(err);
            } else {
                console.log("save happened, dissing mongoose");
                    res.render("user/variant", {
                        success: "a je tam! mas dalsi?",
                        prodID: req.body.productID
                    });
            }
        });
    } else {
        console.log("else on upload fired");
        res.render("user/admin", {
            error: "neco sa pokazilo, napis Viktorovi"
        });
    }
});


var produUpload = upload.fields([{ name: 'InputFile', maxCount: 1 }, { name: 'thumbFile', maxCount: 1 }]);
router.post("/upload",
// jeAdmin,
produUpload, function(req, res, next) {
    console.log(req.body);
    var mongoObject = new Product ({
            imagePath : "",
            thumbPath : "",
            title : req.body.nazov,
            description : req.body.popis,
            price : req.body.cena,
            category: req.body.kategoria,
            brand: req.body.znacka,
            color: req.body.farba
        });
        console.log(req.files);
    if (req.files) {
        console.log("if on upload fired");
        mongoObject.imagePath = "/images/produkty/" + req.files['InputFile'][0].filename;
        mongoObject.thumbPath = "/images/produkty/" + req.files['thumbFile'][0].filename
        console.log(mongoObject);
        mongoObject.save(function(err, result) {
            if (err) {
                console.log("neco sa dojebalo");
                console.log(err);
            } else {
                console.log("save happened, dissing mongoose");
                res.render("user/admin", {
                    success: "podarilo sa"
                });
            }
        });
    } else {
        console.log("else on upload fired");
        res.render("user/admin", {
            error: "neco sa pokazilo, zavolaj Viktorovi"
        });
    }
});

router.get("/adminDelete",
// jeAdmin,
function(req,res,next) {
  res.render("user/adminDelete")
})

router.post("/adminSearch",
// jeAdmin,
function(req,res,next) {
  console.log(req.body);
  if (req.body.variantOption) {
    var productID = req.body.productID;
    console.log(productID);
    console.log("going Variant searching");
    var variants = Variant.find({"productID" : productID}, function (err, docs) {
        if (err) {
          console.log(err);
          res.render("user/adminDelete", { error : "variant search nefungoval"});
        } else {
          console.log(docs);
          res.render("user/adminDelete", { products : docs,
          variant : true });
        }
    })
  } else {
    console.log("going product searching");
    var searchString = req.body.search;
    var products = Product.find({"$text": {"$search":"'"+ searchString + "'" }}, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
        res.render('user/adminDelete', { success:"našiel som",
         products: docs });
        }
      })
    }
});

function deleteFiles(files, callback){
  fs.unlink
  var i = 2;
  files.forEach(function(files){
    fs.unlink(files.filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

router.post("/adminDelete",
// jeAdmin,
function(req,res,next) {
  var basePath = "./public",
      imagePath = basePath + req.body.imagePath,
      thumbPath = basePath + req.body.thumbPath;
  if (req.body.variantDelete) {
    var variantID = req.body.variantID;
    Variant.findById(variantID).remove(function (err, resp) {
      if (err) {
        console.log(err);
        res.render("user/adminDelete", { error: "nope, nevymazal som"});
      } else {
        fs.unlink(imagePath, function (err) {
          if (err) {
            console.log(err);
            res.render("user/adminDelete", { error: "neisiel mi vymazat velky obrazok"});
          } else {
            fs.unlink(thumbPath, function (e) {
              if (e) {
                console.log(e);
                res.render("user/adminDelete", { error: "neisiel mi vymazat maly obrazok"});
              } else {
                res.render("user/adminDelete", { success:"vymazal som variant"});
              }
            })
          }
        });
      }
    })
  } else {
    var prodID = req.body.productID;
    Product.remove({"_id": prodID}, function (err, response) {
      if (err) {
        console.log(err);
        res.render("user/adminDelete", { error: "nope, nevymazal som"})
      } else {
          fs.unlink(imagePath, function (err) {
            if (err) {
              console.log(err);
              res.render("user/adminDelete", { error: "neisiel mi vymazat velky obrazok"});
            } else if (req.body.thumbPath) {
              fs.unlink(thumbPath, function (e) {
                if (e) {
                  console.log(e);
                  res.render("user/adminDelete", { error: "neisiel mi vymazat maly obrazok"});
                } else {
                  res.render('user/adminDelete', { success:"vymazal som Produkt"});
                }
              })
            } else {
              res.render('user/adminDelete', { success:"vymazal som Produkt"});
            }
          });
        }
      })
    }
});

router.get("/kosik", function(req, res, next) {
    if (!req.session.cart) {
        return res.render("shop/kosik", {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render("shop/kosik", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


// router.get("/pay", function(req, res, next) {
// res.sendFile(__dirname + '/pay.html');
// });

router.get("/client-token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});
//parfsered@mail.t-com.sk

router.get("/email", function (req, res, next) {
    var confirmedDetails = req.session.shipping,
        cart = req.session.cart;
    // console.log(confirmedDetails);
    var sub = "Potvrdenie objednávky",
        mejl = confirmedDetails.email,
        bcc = "topes.jebal@gmail.com",
        txt = "Ahoj " + confirmedDetails.meno + ", tvoja objednávka bola prijatá a čo nevidieť ti ju posielam. Ďakujem že si u nás nakúpila. <3";
        var order = new Order({
                user: req.user || "5884e80eae21f8360e50632a",
                firstName: confirmedDetails.meno,
                lastName: confirmedDetails.priezvisko,
                cart: cart,
                ulica: confirmedDetails.ulica,
                cislo: confirmedDetails.cislo,
                mesto: confirmedDetails.mesto,
                PSC: confirmedDetails.psc,
                transactionId: "dobierka"
        });
        console.log(order);
        order.save(function(chyba, vysledok){
            console.log("prave som ulozil do data, idem poslat mejl");
            if (chyba) {
                console.log(chyba);
                res.render("user/userprofile", {success: "neulozil som objednavku"})
            } else {
                console.log("posielam mejl");
                // req.session.cart = null;
                var mailOptions = {
                    from: "Objednavky@deborahmilano.sk",
                    to: mejl,
                  //   bcc: bcc,
                    subject: sub,
                    text: txt
                };
                nodemailerMailgun.sendMail(mailOptions, function (err, info) {
                      if (err) {
                          console.log(err);
                       } else {
                         console.log("mail poslany nacitam stranku");
                         console.log(info);
                         req.session.cart = null;
                         return res.render("user/userprofile", {success:"email sa poslal"});
                     }
                });
          }
      });
});

// router.get("/email", function (req, res) {
//     res.render("user/userprofile");
// })

router.get("/shipping", function (req, res, next) {
    if (req.isAuthenticated())
    {
        res.render("shop/shipping");
    } else {
        res.render("shop/shipping", {
            notLoggedIn: true
        });
    }
});

router.post("/shipping", function (req, res, next) {
    var shipping = {
        meno: req.body.meno,
        priezvisko: req.body.priezvisko,
        email: req.body.email,
        ulica: req.body.ulica,
        cislo: Number(req.body.cislo),
        mesto: req.body.mesto,
        psc: Number(req.body.psc),
        platba: Number(req.body.platba)
    };
    console.log(shipping);
    req.session.shipping = shipping;
    if (shipping.platba == 1) {
    res.sendFile(__dirname + '/pay.html');
    }
    if (shipping.platba == 2) {
        var cart = new Cart(req.session.cart);
        res.render("shop/confirm", {ship: shipping, products: cart.generateArray(), totalPrice: cart.totalPrice});
    }
    if (shipping.platba == 3) {
        res.redirect("user/userprofile");
        //BITCOIN SHEKELZ HERE
    }
});

router.post("/checkout", function (req, res, next) {
    function checkout(req, res, next) {
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        var body = req.body,
          shipping = req.session.shipping;
        // console.log(shipping);
        var nonceFromTheClient = body[Object.keys(body)[0]];
        // console.log(nonceFromTheClient);
        gateway.transaction.sale({
            amount: cart.totalPrice,
            paymentMethodNonce: nonceFromTheClient,
            customer: {
                email: shipping.email
            },
            shipping: {
                firstName: shipping.meno,
                lastName: shipping.priezvisko,
               streetAddress: shipping.ulica,
               extendedAddress: shipping.cislo,
               locality: shipping.mesto,
              postalCode: shipping.psc,
            },
            options: {
              submitForSettlement: true
             }
        }, function (err, result) {
          if (err) {
              console.log(err);
              res.render("user/userprofile", {
                  success: "neco sa dojebalo... pri transaction sale"
              });
          } else {
              if (result.success === true) {
                  var order = new Order({
                          user: req.user,
                          cart: cart,
                          firstName: shipping.meno,
                          lastName: shipping.priezvisko,
                          ulica: shipping.ulica,
                          cislo: shipping.cislo,
                          mesto: shipping.mesto,
                          PSC: shipping.psc,
                          transactionId: result.transaction.id
                  });
                  order.save(function(chyba, vysledok){
                      if (chyba) {
                          console.log(chyba);
                          //daj sem nejaky redirect alebo co
                      } else {
                          var sub = "Potvrdenie objednávky",
                              mejl = shipping.email,
                              bcc = "topes.jebal@gmail.com",
                              txt = "Ahoj " + shipping.meno + " tvoja objednávka bola prijatá a čo nevidieť ti ju posielam. Ďakujem že si u nás nakúpila. <3";
                          var mailOptions = {
                              from: "Objednavky@deborahmilano.sk",
                              to: mejl,
                            //   bcc: bcc,
                              subject: sub,
                              text: txt
                          };
                          nodemailerMailgun.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                 } else {
                                   console.log("mail poslany nacitam stranku");
                                   console.log(info);
                                   req.session.cart = null;
                               } return res.render("user/userprofile", {success:"email sa poslal"});
                          });
                      }
                  });
              } else {
                  // res.sendFile(__dirname + '/pay.html');
                  res.render("user/userprofile", {
                      success: "nie je tam success true"
                  });
              }
          }
        });
    }

    if (req.user) {
        checkout(req, res, next);
    } else {
        req.user = "5884e80eae21f8360e50632a";
        console.log(req.user);
        checkout(req, res, next);
    }
});


router.post("/variantsearch", function (req, res, next) {
    console.log("Im looking for" + req.body.search);
    var searchString = req.body.search;
    Product.find({"$text": {"$search":"'"+ searchString + "'" }}, function (err, docs) {
        if (err) {
            console.log("if on variant search went " + err);
        } else {
            console.log("else on variant search went");
            console.log(docs);
            res.send( {"results" : docs} );
        }
    });
});


module.exports = router;

function jeAdmin(req, res, next) {
    console.log("je Admin naskocil");
    console.log(req.session);
    if (req.session.admin) {
        console.log("toto je admin");
        next();
    } else {
        console.log("toto nie je admin");
        res.redirect("/user/login");
    }
}

function jePrihlaseny(req, res, next) {
    console.log("je prihlaseny");
    if (req.isAuthenticated()) {
        console.log("je autentikovany");
        return next();
    }
    req.session.stareUrl = req.url;
    res.redirect("/user/login");
}
