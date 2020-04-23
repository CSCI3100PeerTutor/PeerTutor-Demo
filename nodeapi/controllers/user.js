const User = require("../models/user");
const _ = require("lodash");
const fs = require("fs"); // file system module

exports.userById = (req, res, next, id) => {
    User.findById(id)
    // populate follower and following array
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({ 
                error: "user not found"
            })
        }
        req.profile = user // add profile object in req with user info
        next();
    })
    
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id

    if(!authorized) {
        return res.status(403).json({ 
            error: "User is not authorized for this action"
        });
    }
    next();
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        // return a users array
        res.json(users)
    }).select("name email updated created"); // return public data only
};

exports.getUser = (req, res) => {
    // these are not shown to user
    req.profile.hashed_password = undefined; 
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile 
    user = _.extend(user, req.body) // want to extend/mutate user object with updated info
    user.updated = Date.now();
    user.save((err) => {
        if(err) {
            return res.status(400).json({
                error: "Not authorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user });
        // next();
    }); // save in database
    
};


exports.deleteUser = (req, res, next) => {
    let user = req.profile
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ message: "User deleted successfully"});
    });
    next();
};


//follow unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId, 
        {$push: {following: req.body.followId}},
        (err, result) =>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            next()
        })
}

exports.addFollower= (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.followId, 
        {$push: {followers: req.body.userId}},
        { new: true }
    )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) =>{
        if(err) {
            return res.status(400).json({
                error:err
            })
        }
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    })
}

// remove following and follower
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId, 
        {$pull: {following: req.body.unfollowId}},
        (err, result) =>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            next()
        })
}

exports.removeFollower= (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.unfollowId, 
        {$pull: {followers: req.body.userId}},
        { new: true }
    )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) =>{
        if(err) {
            return res.status(400).json({
                error:err
            })
        }
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    })
}

exports.findPeople = (req, res) => {
    let following = req.profile.following
    following.push(req,profile._id)
    // find all users except following and user itself
    User.find({_id: {$nin: following}}, (err, users) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users)
    }).select("name")// only need to send name
}