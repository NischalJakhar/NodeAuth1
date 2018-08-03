var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../models/user');

passport.use(new FacebookStrategy({
        clientID: 'null',
        clientSecret: 'null',
        callbackURL: "null",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {

        return cb(null, profile);

    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


router.get('/login/facebook',
    passport.authenticate('facebook'));

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });
router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

// var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
});


/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
    clientID: 'null',
    clientSecret: 'null',
    callbackURL: 'null'
}, function(accessToken, refreshToken, profile, cb) {
    console.log('profile is ' + JSON.stringify(profile));

    return cb(null , profile);

}
));



// }, (req, accessToken, refreshToken, profile , done) => {
//     if (req.user) {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//         if (err) { return done(err); }
//         if (existingUser) {
//             req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//             done(err);
//         } else {
//             User.findById(req.user.id, (err, user) => {
//             if (err) { return done(err); }
//             user.google = profile.id;
//     user.tokens.push({ kind: 'google', accessToken });
//     user.profile.name = user.profile.name || profile.displayName;
//     user.profile.gender = user.profile.gender || profile._json.gender;
//     user.profile.picture = user.profile.picture || profile._json.image.url;
//     user.save((err) => {
//         req.flash('info', { msg: 'Google account has been linked.' });
//     done(err, user);
// });
// });
// }
// });
// } else {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//         if (err) { return done(err); }
//         if (existingUser) {
//             return done(null, existingUser);
//         }
//         User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
//         if (err) { return done(err); }
//         if (existingEmailUser) {
//             req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
//             done(err);
//         } else {
//             const user = new User();
//     user.email = profile.emails[0].value;
//     user.google = profile.id;
//     user.tokens.push({ kind: 'google', accessToken });
//     user.profile.name = profile.displayName;
//     user.profile.gender = profile._json.gender;
//     user.profile.picture = profile._json.image.url;
//     user.save((err) => {
//         done(err, user);
// });
// }
// });
// });
// }
// }));

router.get('/login/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/login/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.getUserById(id, function(err, user) {
//     done(err, user);
//   });
// });

// passport.use(new LocalStrategy(function(username, password, done){
//   User.getUserByUsername(username, function(err, user){
//     if(err) throw err;
//     if(!user){
//       return done(null, false, {message: 'Unknown User'});
//     }
//
//     User.comparePassword(password, user.password, function(err, isMatch){
//       if(err) return done(err);
//       if(isMatch){
//         return done(null, user);
//       } else {
//         return done(null, false, {message:'Invalid Password'});
//       }
//     });
//   });
// }));

//
//
//
// router.post('/register', upload.single('profileimage') ,function(req, res, next) {
//   var name = req.body.name;
//   var email = req.body.email;
//   var username = req.body.username;
//   var password = req.body.password;
//   var password2 = req.body.password2;
//
//   if(req.file){
//   	console.log('Uploading File...');
//   	var profileimage = req.file.filename;
//   } else {
//   	console.log('No File Uploaded...');
//   	var profileimage = 'noimage.jpg';
//   }
//
//   // Form Validator
//   req.checkBody('name','Name field is required').notEmpty();
//   req.checkBody('email','Email field is required').notEmpty();
//   req.checkBody('email','Email is not valid').isEmail();
//   req.checkBody('username','Username field is required').notEmpty();
//   req.checkBody('password','Password field is required').notEmpty();
//   req.checkBody('password2','Passwords do not match').equals(req.body.password);
//
//   // Check Errors
//   var errors = req.validationErrors();
//
//   if(errors){
//   	res.render('register', {
//   		errors: errors
//   	});
//   } else{
//   	var newUser = new User({
//       name: name,
//       email: email,
//       username: username,
//       password: password,
//       profileimage: profileimage
//     });
//
//     User.createUser(newUser, function(err, user){
//       if(err) throw err;
//       console.log(user);
//     });
//
//     req.flash('success', 'You are now registered and can login');
//
//     res.location('/');
//     res.redirect('/');
//   }
// });

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
