const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");


const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary')



///..............................................sign up..........................................................
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth-signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email

  if (username === "" || password === "") {
    res.render("auth-signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth-signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      firstName,
      lastName,
      email
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth-signup", { message: "Something went wrong" });
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/profile');
        })
      }
    });
  })
  .catch(error => {
    next(error)
  })
});





///..............................................Log in...and.....Log out........................................................

authRoutes.get("/login", (req, res, next) => {
  res.render("auth-login", { "message": req.flash("error") });
});
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()  )
      return next();
  res.redirect('/');


}

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});






authRoutes.get("/private-page", isLoggedIn, (req, res) => {
  res.render("addItem", { user: req.user });
});




// ///..............................................Add main page..........................................................

authRoutes.get('/add-Main-page',isLoggedIn,(req,res,next) =>{
  //User.find().then(inofFromDB => {  //no good because it returns an array of ALL the users
  //User.findById(req.user._id).then(inofFromDB => {  this works and so does the one below

  User.findOne({_id:req.user._id}).then(inofFromDB => { 
    console.log('upland...........................', inofFromDB)
  res.render('add-Main-page',{Restaurant:inofFromDB })
  })
  });


authRoutes.post('/mainSite', isLoggedIn, uploadCloud.single('Photo'),(req,res,next)=>{
    console.log('post',req.body)
    const { nameRestaurant, description } = req.body;
    let image = ''
    if(req.file){
      image = req.file.url;
    }
    //const imgName = req.file.originalname;

    User.findById(req.user._id).then(ourUser =>{
        ourUser.image = image;
        ourUser.description = description;
        ourUser.name = nameRestaurant
        
        ourUser.save(function(err){
          if(!err){
            res.redirect(`/restaurant/${req.user.username}`)
          }
        })
        
    })
  })

 










  





















module.exports = authRoutes;