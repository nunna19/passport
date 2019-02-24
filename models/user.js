// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName:String,
  email:String,

  // appetizer:Boolean,
  // mainDish: Boolean,
  // desserts: Boolean,
  // beverages:Boolean,
  item:String,
  
  name:String,
  description: String,
  price:Number,
  image:String,
  imgName:String

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
