// Basic Express server with CRUD routes
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const StudyModel = require('./Models/Study')

const app = express()
app.use(cors())
app.use(express.json())

//connect test DB and store data in studdylist collection
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
app.get('/get', (req, res) => {
  StudyModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
app.post('/add', (req, res) => {
  const { task } = req.body
  StudyModel.create({ task })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
app.put('/update/:id', (req, res) => {
  const { id } = req.params
  StudyModel.findByIdAndUpdate(id, { done: true }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params
  StudyModel.findByIdAndDelete(id)
    .then(() => res.json({ message: 'Deleted' }))
    .catch(err => res.json(err))
})
app.listen(3001, () => console.log('Server running on 3001'))
