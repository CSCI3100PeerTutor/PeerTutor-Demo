const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

// initialize the code
admin.initializeApp();

// firebase webapp config using the CSCI3100TEAM1@gmail.com account
// password is F!rebase
const firebaseConfig = {
    apiKey: "AIzaSyCA6UTrIHSYnBDpYcWvXeD7Yvdoi_plEGc",
    authDomain: "peertutor-18908.firebaseapp.com",
    databaseURL: "https://peertutor-18908.firebaseio.com",
    projectId: "peertutor-18908",
    storageBucket: "peertutor-18908.appspot.com",
    messagingSenderId: "15916059974",
    appId: "1:15916059974:web:b6e59a0285e26c1352a947",
    measurementId: "G-MQMENTLBV3"
  };
  
  // check whether a string is empty
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/posts', (req, res) => {
    admin
    .db()
    .collection('posts')
    .get()
    .then((data) => {
        let posts = [];
        data.forEach((doc) => {
            posts.push(doc.data());
        });
        return res.json(posts);
    })
    .catch(err => console.error(err));
});

// publishing a post

app.post('/posts', (req, res) => {
    if(isEmpty(req.body.description)) {
        return res.status(400).json({ body: 'description must not be empty'});
    }
    if(isEmpty(req.body.course)) {
        return res.status(400).json({ body: 'course must not be empty'});
    }

    const newPosts = {
        description: req.body.description,
        userName: req.body.userName,
        createdAt: new Date().toISOString(),
        type: req.body.type,
        course: req.body.course
    };

    db
        .collection('posts')
        .add(newPosts)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong'}); //note that status 500 is a server error code
            console.error(err);
        });
});



// this regex needs to be updated so that only CUHK emails are accepted
// for instance xxxxxxxxxx@link.cuhk.edu.hk
const isEmail = (email) => {
    const regEx = /^\b[A-Za-z0-9._%+-]+@(link.cuhk.edu.hk)/;
    if(email.match(regEx)) return true;
    else return false;
};

// Signup route
app.post('/signup', (req, res) => {
    //for testing purpose, the newUser does not have all of its attributes yet
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        name: req.body.name
    };

    let errors =  {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Email must not be empty'
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address'
    };

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(newUser.name)) errors.name = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);
    

    // TODO: validate data
    let token, userId;
    db.doc(`/users/${newUser.name}`)
        .get()
        .then((doc) => {
            if(doc.exists){ // bad request, cannot have duplicate handles
                return res.status(400).json({ name: 'this name is already taken' });
            } else {
                return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                name: newUser.name,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.name}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use'})
            } else {
                return res.status(500).json({ error: err.code });
            }
        }); 
});
// login page
app.post('/login', (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors.email = 'Must not be empty';
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
        return data.getIdToken();
    })
    .then((token) => {
        return res.json({ token });
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code }); 
    })
})

exports.api = functions.https.onRequest(app);
// funtions.region('') to change the region to reduce latency