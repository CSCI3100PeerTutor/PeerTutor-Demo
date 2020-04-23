const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    
  postedBy: {type: ObjectId,ref: "User"},
  postType: {type: String,required: true},
  course:{type:String, required:true},
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;