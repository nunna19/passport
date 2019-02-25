const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const Item= require("../models/item");

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
          res.redirect('/private-page');
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
  successRedirect: "/private-page",
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




///..............................................Add Item..........................................................

authRoutes.get('/allMenu',isLoggedIn,(req,res,next) =>{
  Item.find().then(inofFromDB => { 
    console.log('upland...........................', inofFromDB)
  res.render('allMenu',{item:inofFromDB })
  })
  });


authRoutes.post('/addItems', isLoggedIn, uploadCloud.single('Photo'),(req,res,next)=>{
  
    console.log('post',req.body)
    const { itemType,name, description,price } = req.body;
    const image = req.file.url;
    const imgName = req.file.originalname;
    const restaurant = req.user._id
    const newAddImg = new Item ({itemType,name, description,price,image, imgName, restaurant })
    newAddImg.save()
    .then(images => {
      res.redirect('/allMenu')

    })
    .catch(error => {
      console.log(error);
    })
})












///..............................................Edit Item..........................................................

authRoutes.get('/item/:id/edit',isLoggedIn, (req, res, next) => {
  console.log('123431242142',req.params)
Item.findById(req.params.id)
.then(menuEdit=>{
  console.log('Edit.........................................',menuEdit)
  res.render('editItem',{menuEdit})
})
.catch(error => {
  console.log(error);
})
});







///..............................................Delete Item..........................................................

authRoutes.post('/item/:id/delete', isLoggedIn,(req, res, next) => {
 
  Item.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/allMenu');
    })
    .catch(err => console.log(err));
});

  

///..............................................page Menu..........................................................

authRoutes.get('/appetizer',isLoggedIn,(req,res,next) =>{
  Item.find({'itemType' :'Appetizer' }).then(inofFromDB => { 
  
    console.log('upland...........................', inofFromDB)
  res.render('appetizer',{item:inofFromDB })
    
  })
  });




  authRoutes.get('/mainDish',isLoggedIn,(req,res,next) =>{
    Item.find({'itemType' :'Main dish' }).then(inofFromDB => { 
    
      console.log('upland...........................', inofFromDB)
    res.render('mainDish',{item:inofFromDB })
      
    })
    });



authRoutes.get('/desserts',isLoggedIn,(req,res,next) =>{
      Item.find({'itemType' :'Desserts' }).then(inofFromDB => { 
      
        console.log('upland...........................', inofFromDB)
      res.render('desserts',{item:inofFromDB })
        
      })
      });



 authRoutes.get('/beverages',isLoggedIn,(req,res,next) =>{
       Item.find({'itemType' :'Beverages' }).then(inofFromDB => { 
        
          console.log('upland...........................', inofFromDB)
        res.render('beverages',{item:inofFromDB })
          
        })
        });
























module.exports = authRoutes;