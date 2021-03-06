const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");
const {ObjectId} = mongoose.Schema;
const Post = require("./post");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{ // hashed version of user's password
        type: String,
        required: true
    },
    salt: String, // long random string
    created:{
        type: Date,
        default: Date.now()
    },
    updated: Date,
    about: {
        type: String,
        trim: true
    },
    following: [{type: ObjectId, ref: "User"}],
    followers: [{type: ObjectId, ref: "User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    reviews: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy: {type: ObjectId, ref: "User"}
        }
    ]
})

/**
 * note that password is a virtual field, as it does not 
 * get stored in the database, it only exist logically and 
 * are not written to the document's collection
 */

 // virtual field
 userSchema.virtual('password')
 .set(function(password) {
     // create temp. variable called _password
     this._password = password
     // generate a timestamp for salt using uuid npm package
     this.salt = uuidv4();
     // encrypt password
     this.hashed_password = this.encryptPassword(password)
 })
 .get(function() {
     return this._password
 })

 // methods
 userSchema.methods = {

    authenticate: function(plainText) { // plainText comes from user input
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password) {
        if(!password) return "";
        try{
        return crypto.createHmac('sha1', this.salt) // created hashed password with salt and password
        .update(password)
        .digest('hex');
        } catch(err){
        return "";
        }
    }
 }

// pre middleware (deletes user's post when user removes itself)
userSchema.pre("remove", function(next) {
    Post.remove({ postedBy: this._id }).exec();
    next();
});

module.exports = mongoose.model("User", userSchema);