// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const itemSchema = new Schema({

  itemType:String,  
  name:String,
  description: String,
  price:Number,
  image:String,
  imgName:String,
  restaurant:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
