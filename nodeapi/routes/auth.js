const express = require("express");
const { signup, signin, signout } = require("../controllers/auth"); // deconstructed so that only need function name
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validators/index");
const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

/** 
 * looking for the parameter userId in the incomin URL
 * anytime there's a parameter of userId, execute a 
 * userById method to get the user information from database
 * and append this information to the request object
 * */ 
router.param("userId", userById);

module.exports = router;

