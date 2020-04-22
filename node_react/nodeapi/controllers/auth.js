const jwt = require("jsonwebtoken"); // token 
require("dotenv").config();
const expressjwt = require("express-jwt"); // protected route
const User = require("../models/user");


// async process, since we need run each line by line
exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email})
    if(userExists) return res.status(403).json({ // unauthorized error
        error: "Email is taken!"
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: "Signup successful!" })
}; 


exports.signin = (req, res) => {
    // find the user based on email
    const {email, password} = req.body
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if(err || !user){
            return res.status(401).json({
                error: "email does not exist"
            })
        }
        // if user is found, authenticate user 
        // create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "wrong password"
            })
        }
        // generate a token with user id and secret (from .env file)
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry data
        res.cookie("t", token, {expire: new Date() + 9999}) // expire after 9999 seconds

        // return response with user and token to frontend client
        const {_id, name, email} = user
        return res.json({token, user: {_id, email, name}})

    })
}

exports.signout= (req, res) => {
    // clear the cookie to signout
    res.clearCookie("t");
    return res.status(200).json({ message: "Signout successful"});
}

exports.requireSignin = expressjwt({
    // if the token is valid, then express-jwt appends the verified user id in
    // an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})