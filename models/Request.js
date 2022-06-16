
import mongoose from 'mongoose'

const RequestSchema = new mongoose.Schema({
  request_sender: {type:String, required:true},
  bookId_that_give : {type: mongoose.ObjectId ,required:true},
  request_receiver : {type:String,required:true},
  bookId_that_want: {type: mongoose.ObjectId ,required:true},
  bumped_on : {type:Date,default:Date.now()},
  accepted : {type:Boolean,default: false}
})

module.exports =  mongoose.models.requests ||  mongoose.model('requests', RequestSchema)
