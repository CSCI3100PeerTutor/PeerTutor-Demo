const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // --- obsolete since we have validator
        // minlength: 4,
        // maxlength: 150
    },
    body:{
        type: String,
        required: true,
        // --- obsolete since we have validator
        // minlength: 4,
        // maxlength: 2000
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy: {type: ObjectId, ref: "User"}
        }
    ]
})

module.exports = mongoose.model("Post", postSchema);