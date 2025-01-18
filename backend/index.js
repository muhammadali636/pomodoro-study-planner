const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors'); 
const StudyModel = require('./Models/Study'); 

const app = express(); //init the Express app
app.use(cors()); 
app.use(express.json()); 

//DB connections
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//GET ALLLL tasks
app.get('/get', function(req, res) {
  StudyModel.find()
    .then(function(result) {
      res.json(result); //Send all tasks
    })
    .catch(function(err) {
      res.json(err);
    });
});

//add new task
app.post('/add', function(req, res) {
  const task = req.body.task; //Get task from request
  StudyModel.create({ task: task })
    .then(function(result) {
      res.json(result); 
    })
    .catch(function(err) {
      res.json(err); 
    });
});

//marks task as done
app.put('/update/:id', function(req, res) {
  const id = req.params.id; //task id
  StudyModel.findByIdAndUpdate(id, { done: true }, { new: true })
    .then(function(result) { 
      res.json(result);
    })
    .catch(function(err) {
      res.json(err); 
    });
});

//Delete a task
app.delete('/delete/:id', function(req, res) {
  const id = req.params.id; //task id
  StudyModel.findByIdAndDelete(id)
    .then(function() {
      res.json({ message: 'Deleted' }); 
    })
    .catch(function(err) {
      res.json(err); 
    });
});

//start server
app.listen(3001, function() {
  console.log('Server running...');
});
