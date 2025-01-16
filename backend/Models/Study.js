const mongoose = require('mongoose') //schema using mongoose for study tasks

const StudySchema = new mongoose.Schema({
  task: String,
  done: {
    type: Boolean,
    default: false
  }
})

//collection name = studylist
module.exports = mongoose.model('StudyList', StudySchema, 'studylist')
