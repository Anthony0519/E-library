const mongoose = require("mongoose");

const librarySchema = mongoose.Schema({
     firstName:{
        type:String,
        required:true
     },
     lastName:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     userName:{
        type:String,
        required:true
     },
     role:{
        type:String,
        enum: ["Admin","Visitor"],
        required:true
     },
     password:{
        type:String,
        required:true
     },
     blackList:{
        type:Array,
        default:[]
     }
})

const dataBase = mongoose.model('e-library', librarySchema)

module.exports = dataBase