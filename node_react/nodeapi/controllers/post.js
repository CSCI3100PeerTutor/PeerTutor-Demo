const Post = require("../models/post");
const formidable = require("formidable"); // parsing form data, especially file uploads
const fs = require("fs"); // file system module
const _ = require("lodash");

// query database and return the post, also populate the user who created most and make it available in req (req.post)
exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
        if(err || !post) {
            return res.status(400).json({
                error: err
            })
        }
        req.post = post;
        next()
    })
}; 

// returns all the post from database
exports.getPosts = (req, res) => {
    const posts = Post.find()
    .populate("postedBy", "_id name") // since postedBy is a ObjectId
    .select("_id title body created") // since we do not want the __v variable
    .sort({created: -1}) // lasted post will come first 
    .then((posts) => {
        res.status(200).json(posts)
    })
    .catch(err => console.log(err));
};


// information is sent by the user via req
exports.createPosts = (req, res, next) => {
    const post = new Post(req.body);
    console.log("creating post: ", req.body)
    post.postedBy = req.profile;
    post.created = Date.now()
    post.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.json(post)
    })
};

// find all the posts by one user
exports.postByUser = (req, res) => {
    Post.find({postedBy: req.profile._id}) // find via "postedBy"
    .populate("postedBy", "_id name")
    .sort("_created") // sort by created data
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    // debugging
    // console.log("req.post", req.post);
    // console.log("req.auth", req.post);
    // console.log("req.post.postedBy._id", req.post.postedBy._id);
    // console.log("req.auth._id", req.auth._id);

    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

exports.updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save((err, post) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        console.log("Post updated: ", post)
        return res.json(post);
    })
}

exports.deletePost = (req, res) => {
    let post = req.post // this comes from postById method
    post.remove((err, post) => {
        if(err) {
            return res.status(400).json({
                errror: err
            })
        }
        return res.json({
            message: "Post deleted successfully"
        })
    })
};

exports.singlePost = (req, res) => {
    return res.json(req.post)
}