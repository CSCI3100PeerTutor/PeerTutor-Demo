const express = require("express");
const app = express(); 
const mongoose = require("mongoose"); // database 
const morgan = require("morgan"); // middleware to show the status of POST/GET requests
const dotenv = require("dotenv");
const bodyparser = require("body-parser"); // middleware that parses json text
const cookieparser = require("cookie-parser");
const expressValidator = require("express-validator"); // middleware validate user entries
const fs = require("fs");
const cors = require("cors");
dotenv.config();

// database 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => { console.log("database connected")});

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
})

// birng in routes
const postRoutes = require("./routes/post"); // protected route
const authRoutes = require("./routes/auth"); // public route
const userRoutes = require("./routes/user"); // public route 
// apiDocs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
      if(err) {
        return res.status(400).json({
          error: err
        })
      }
      const docs = JSON.parse(data);
      return res.json(docs);
  })
})

// middleware 
app.use(morgan("dev"));
app.use(bodyparser.json()); // for parsing json, NOTE: this must be placed before postRoutes middleware
app.use(cookieparser());
app.use(expressValidator());
app.use(cors()); // allow communication between frontend and backend (since front and back are on different servers)
app.use("/", postRoutes); 
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: "Unauthorized" });
    }
  });

const port = 8080
app.listen(port, () => {console.log(`A Node Js API is listening on port ${port}`)
});
