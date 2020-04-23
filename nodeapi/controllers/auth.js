const jwt = require("jsonwebtoken"); // token 
require("dotenv").config();
const expressjwt = require("express-jwt"); // protected route
const User = require("../models/user");
// for password reset
const _ = require("lodash");
const { sendEmail } = require("../helpers");
const dotenv = require("dotenv");
dotenv.config();

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


exports.forgotPassword = (req, res) => {
    // error response
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });
 
    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });
 
        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );
 
        // email data, upon clicking link, redirect to react frontend app, capture token
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };
 
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

 

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    // find the user in the database with user's resetPasswordLink
    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });
    
        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };
 
        user = _.extend(user, updatedFields);
        user.updated = Date.now();
 
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};