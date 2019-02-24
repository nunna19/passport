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
  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}

authRoutes.get("/private-page", isLoggedIn, (req, res) => {
  res.render("addItem", { user: req.user });
});



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});






///..............................................Add Item..........................................................

// authRoutes.get('/',(req,res,next) =>{
//   console.log('get in fo from database work.....................')
//   User.find().then(inofFromDB => { 
//     console.log(inofFromDB, 'inofFromDB')
//   res.render('/index',{item:inofFromDB })
//   })
//   });


authRoutes.post('/addItems', uploadCloud.single('Photo'),(req,res,next)=>{
  
    console.log('post',req.body)
    const { item,name, description,price } = req.body;
    const image = req.file.url;
    const imgName = req.file.originalname;
    const newAddImg = new User ({item,name, description,price,image, imgName, })
    newAddImg.save()
    .then(images => {
      res.redirect('/')

    })
    .catch(error => {
      console.log(error);
    })
})

///..............................................Edit Item..........................................................

// router.get('/editItem', (req, res, next) => {
//   res.render("editItem");
// });

// authRoutes.get('/editItems'),(req,res,next)=>{
// user.findById(req.params.id).then(thatItem=>{
//   res.render('index',{item: thatItem})
// })
// .catcg(err=> console.log(err))
// }

authRoutes.delete('/item/:id/delete', (req, res, next) => {
  console.log('/////////////////////////////////')
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/index');
    })
    .catch(err => console.log(err));
});















module.exports = authRoutes;