var express = require("express"),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require("cookie-parser"),
    bodyParser = require('body-parser'),
    expressHbs = require("express-handlebars"),
    mongoose = require("mongoose"),
    session = require("express-session"),
    passport = require("passport"),
    validator = require("express-validator"),
    MongoStore = require("connect-mongo")(session),
    flash = require("connect-flash"),
    multer = require("multer"),
    // config file with all API keys
    config = require("./models/config"),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/public/images/produkty');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname +".jpg" );
        }
    });
    upload = multer({storage: storage});

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

mongoose.Promise = global.Promise;
mongoose.connect("localhost:27017/eshop", function () {
    console.log("I'm connecting to Mongo");
});
require("./config/passport");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Mongo here: this is working!");
});

// view engine setup
app.engine(".hbs", expressHbs({
    defaultLayout: 'layout', extname: ".hbs"
}));
app.set('view engine', ".hbs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: config.passportSecret,
    resave:false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
