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
    if(req.body.description.trim()=== '') {
        return res.status(400).json({ body: 'description must not be empty'});
    }
    if(req.body.course.trim()=== '') {
        return res.status(400).json({ body: 'course must not be empty'});
    }

    const newPosts = {
        description: req.body.description,
        name: req.body.name,
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

// check whether a string is empty
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

// this regex needs to be updated so that only CUHK emails are accepted
// for instance xxxxxxxxxx@link.cuhk.edu.hk
const isEmail = (email) => {
    const regEx = /^\b[A-Za-z0-9._%+-]+@(link.cuhk.edu.hk)/;
    if(email.match(regEx)) return true;
    else return false;
};



exports.api = functions.https.onRequest(app);
// funtions.region('') to change the region to reduce latency