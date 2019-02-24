const express = require('express');
const router  = express.Router();
const User = require("../models/user");
/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get('/',(req,res,next) =>{
  console.log('get in fo from database work.....................')
  User.find().then(inofFromDB => {
  res.render('index',{item:inofFromDB })
  })
  });

module.exports = router;
