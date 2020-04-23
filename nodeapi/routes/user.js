const express = require("express");
const { userById, allUsers, getUser, updateUser, deleteUser, hasAuthorization, addFollowing, addFollower, removeFollower, removeFollowing, findPeople} = require("../controllers/user");
const router = express.Router();
const { requireSignin } = require("../controllers/auth");

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);
router.get("/users", allUsers);
// must be a signed in user
router.get("/user/:userId", requireSignin, getUser); 
// must be signed in and can only update own profile 
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser); 
router.delete("/user/:userId", requireSignin, deleteUser); // delete to delete
// who to follow
router.get('/user/finderpeople/:userId', requireSignin, findPeople);
// any route containing userId will call userByID() method first
router.param("userId", userById);

module.exports = router