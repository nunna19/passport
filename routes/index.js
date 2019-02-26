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
  res.render('index', {user:req.user});
});


router.get('/profile', isLoggedIn, (req, res, next) => {
  //res.render('profile', {user:req.user})
  Item.find().then(inofFromDB => { 
    console.log('upland......profile.....................', inofFromDB)
    res.render('profile', {user:req.user, item:inofFromDB })
  })
});





///..............................................Add Item..........................................................

router.get('/restaurant/:username',isLoggedIn,(req,res,next) =>{
  Item.find().then(inofFromDB => { 
    console.log('upland...........................', inofFromDB)
  res.render('allMenu',{
      item:inofFromDB, 
      mainPicture:req.user.image
      
  })
  });
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
        item.price = req.body.price
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

router.get('/appetizer',isLoggedIn,(req,res,next) =>{
  Item.find({'itemType' :'Appetizer' }).then(inofFromDB => { 
  
    console.log('upland...........................', inofFromDB)
  res.render('appetizer',{item:inofFromDB })
    
  })
  });




  router.get('/mainDish',isLoggedIn,(req,res,next) =>{
    Item.find({'itemType' :'Main dish' }).then(inofFromDB => { 
    
      console.log('upland...........................', inofFromDB)
    res.render('mainDish',{item:inofFromDB })
      
    })
    });



router.get('/desserts',isLoggedIn,(req,res,next) =>{
      Item.find({'itemType' :'Desserts' }).then(inofFromDB => { 
      
        console.log('upland...........................', inofFromDB)
      res.render('desserts',{item:inofFromDB })
        
      })
      });



 router.get('/beverages',isLoggedIn,(req,res,next) =>{
       Item.find({'itemType' :'Beverages' }).then(inofFromDB => { 
        
          console.log('upland...........................', inofFromDB)
        res.render('beverages',{item:inofFromDB })
          
        })
        });









function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()  )
      return next();
  res.redirect('/login');


}
module.exports = router;
