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
    .select("_id title body") // since we do not want the __v variable
    .then((posts) => {
        res.status(200).json({ posts })
    })
    .catch(err => console.log(err));
};


// information is sent by the user via req
exports.createPosts = (req, res, next) => {
    let form = new formidable.IncomingForm() // now expects form data
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)
        // remove sensitive fields from req.profile
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;

        post.postedBy = req.profile;
        if(files.photo) { // if file has photo
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        });
    });
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
