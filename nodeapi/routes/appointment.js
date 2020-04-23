const router = require('express').Router();
let Appointment = require('../models/appointment');

router.route('/').get((req, res) => {
  Exercise.find()
    .then(appointment => res.json(appointment))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  //add expects 
  const postedBy = req.body.postedBy;
  const postType = req.body.postType;
  const course=req.body.course;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);
  //add takes
  const newAppointment = new Appointment({
    postedBy,
    postType,
    course,
    description,
    duration,
    date,
  });
// add saves
  newAppointment.save()
  .then(() => res.json('Appointment added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Appointment.findById(req.params.id)
    .then(appointment => res.json(appointment))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Appointment.findByIdAndDelete(req.params.id)
    .then(() => res.json('Appointment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Appointment.findById(req.params.id)
    .then(appointment => {
        appointment.username = req.body.username;
        appointment.course=req.body.course;
        appointment.description = req.body.description;
        appointment.duration = Number(req.body.duration);
        appointment.date = Date.parse(req.body.date);
      
        appointment.save()
        .then(() => res.json('Appointment updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;