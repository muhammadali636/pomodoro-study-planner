//to show and update tasks aka (Home)
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Create from './Create'
import { BsFillCheckCircleFill, BsCircle, BsFillTrashFill } from 'react-icons/bs'

function Home() {
  const [studies, setStudies] = useState([])

  //task (studylists) on load
  const fetchStudies = () => {
    axios.get('http://localhost:3001/get')
      .then(res => setStudies(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchStudies()
  }, [])

  //finished
  const handleDone = (id) => {
    axios.put(`http://localhost:3001/update/${id}`)
      .then(() => fetchStudies())
      .catch(err => console.log(err))
  }

  //deletre task
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => fetchStudies())
      .catch(err => console.log(err))
  }

  return (
    <div className='home'>
      <h2>Pomodoro Study Planner </h2>
      <Create onSuccess={fetchStudies} />

      {studies.length === 0 ? (
        <div className='noRecText'>No Record (Enter Something to Study)</div>
      ) : (
        studies.map(study => (
          <div key={study._id} className='task'>
            <div onClick={() => handleDone(study._id)}>
              {study.done ? <BsFillCheckCircleFill /> : <BsCircle />}
              <span className={study.done ? 'line-through' : ''}>
                {study.task}
              </span>
            </div>
            <div onClick={() => handleDelete(study._id)}>
              <BsFillTrashFill />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Home
