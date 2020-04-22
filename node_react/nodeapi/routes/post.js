const express = require("express");
const { getPosts, createPosts, postByUser, postById, isPoster, deletePost, updatePost, singlePost, comment, uncomment} = require("../controllers/post"); // deconstructed so that only need function name
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {createPostValidator} = require("../validators/index");
const router = express.Router();

// Comment routes
router.put("/post/comment", requireSignin, comment)
router.put("/post/uncomment", requireSignin, uncomment)

router.get("/posts", getPosts);
router.get("/post/:postId", singlePost)
// only when user is signed in && validation is passed the next middleware will be called
router.post("/post/new/:userId", requireSignin, createPosts, createPostValidator);
router.get("/posts/by/:userId", requireSignin, postByUser);
// can only delete or update post if user is the owner of post
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost)
/** 
 * looking for the parameter userId in the incomin URL
 * anytime there's a parameter of userId, execute a 
 * userById method to get the user information from database
 * and append this information to the request object
 * */ 
router.param("userId", userById);
// any route containing userId will call userByID() method first
router.param("postId", postById);



module.exports = router;

