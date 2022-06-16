

import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
  name: {type: String, required:true},
  owner: {type: String, required:true},
  author:{type: String, required:true},
  description : {type: String},
  bumped_on : {type:Date,default:Date.now()}
})

module.exports = mongoose.models.books || mongoose.model('books', BookSchema)