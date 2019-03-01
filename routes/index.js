const express = require('express');
const router  = express.Router();
const User = require("../models/user");
const Item = require("../models/item");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('homepage', {user:req.user});
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()  )
      return next();
  res.redirect('/login');


}




router.get('/profile', isLoggedIn, (req, res, next) => {
  //res.render('profile', {user:req.user})
  Item.find({restaurant:req.user._id}).then(inofFromDB => { 
    console.log('upland......profile.....................', inofFromDB)
    res.render('profile', {user:req.user, item:inofFromDB })
  })
});





///..............................................Add Item..........................................................



router.get('/restaurant/:username',(req,res,next) =>{ //THIS IS THE ONE THAT NEEDS MOST STYLING
  User.findOne({username:req.params.username}).then(user=>{
    Item.find({restaurant:user._id}).then(inofFromDB => { 
      console.log('upland...........................', inofFromDB)
      res.render('view-customer',{ //VIEW CUSTOMER.HBS
          item:inofFromDB, 
          mainPicture:user.image, 
          description: user.description,
          user:user,   
      })
    });
  })
})


 

router.post('/addItems', isLoggedIn, uploadCloud.single('Photo'),(req,res,next)=>{
  
    console.log('post',req.body)
    const { itemType,name, description,price } = req.body;
    const image = req.file.url;
    const imgName = req.file.originalname;
    const restaurant = req.user._id
    const newAddImg = new Item ({itemType,name, description,price,image, imgName, restaurant })
    newAddImg.save()
    .then(images => {
      res.redirect(`/restaurant/${req.user.username}`)

    })
    .catch(error => {
      console.log(error);
    })
})












///..............................................Edit Item..........................................................

router.get('/item/:id/edit',isLoggedIn, (req, res, next) => {
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


router.post('/item/:id/edit',isLoggedIn, uploadCloud.single('Photo'), (req, res, next) => {
    console.log('req.body',req.body)

    Item.findById(req.params.id)
      .then(item=>{
        console.log('edit item',item)
        item.itemType =req.body.itemType
        item.name = req.body.name
        item.description = req.body.description
        item.price = req.body.price
        item.image= req.file.url;
        item.save();
        res.redirect('../../profile')
      })
      .catch(error => {
        console.log(error);
      })
})




///..............................................Delete Item..........................................................

router.post('/item/:id/delete', isLoggedIn,(req, res, next) => {
 
  Item.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => console.log(err));
});

  

///..............................................page Menu..........................................................



 
router.get('/restaurant/:username/:id/:itemType',(req,res,next) =>{

  console.log('we are in here',req.params, res.user)
  User.findOne({username:req.params.username}).then(user=>{
  let itemType = req.params.itemType;
  console.log(req.params, req.user, req.body)
  Item.find({itemType:itemType,restaurant:req.params.id}).then(items=>{
    console.log('sfgsfdgfdsgfdsgs',items)
    res.render('items.hbs', {items:items, itemType:itemType, user:user})

  })
})
  });


  // router.get('/restaurant/:username/:id/:itemType',(req,res,next) =>{

  //   console.log('we are in here',req.params, res.user)
    
  //   let itemType = req.params.itemType;
  //   Item.find({itemType:itemType,restaurant:req.params.id}).then(items=>{
  //     console.log(items)
  //     res.render('items.hbs', {items, itemType})
  
  //   })

  //   });


  









module.exports = router;
