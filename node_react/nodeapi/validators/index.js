exports.createPostValidator = (req, res, next) => {
    // title
    req.check('title', "Title must not be empty").notEmpty() // check whether input is empty
    req.check('title', "Title must be 4-150 characters").isLength({ // check length
        min: 4,
        max: 150
    });

    // body
    req.check('body', "Body must not be empty").notEmpty() // check whether input is empty
    req.check('body', "Body must be 4-2000 characters").isLength({ // check length
        min: 4,
        max: 2000
    });
    // check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if(errors) {
        const firstError = errors.map((error) => error.msg)[0] // array [0]: only give the first error
        return res.status(400).json({error: firstError}) // error code
    }

    // proceed to next middleware
    next();
};


exports.userSignupValidator = (req, res, next) => {
    // name is not null
    req.check('name', "Name is required").notEmpty();

    // check email
    req.check("email", "Email must be 3 to 32 characters")
    .matches(/^\d{10}@link.cuhk.edu.hk/) // regex to match CUHK email
    .withMessage("Email must be CUHK email");

    // check for password
    req.check("password", "Password is required").notEmpty();
    req.check('password')
    .isLength({min: 6})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors()
    if(errors) {
        const firstError = errors.map((error) => error.msg)[0] // array [0]: only give the first error
        return res.status(400).json({error: firstError}) // error code
    }

    // proceed to next middleware
    next();
} 

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};