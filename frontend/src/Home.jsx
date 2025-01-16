import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Create from './Create'
import { BsFillCheckCircleFill, BsCircle, BsFillTrashFill } from 'react-icons/bs'
import Pomodoro from './Pomodoro'

function Home() {
  const [studies, setStudies] = useState([])

  //fetch tasks on load
  const fetchStudies = () => {
    axios.get('http://localhost:3001/get')
      .then(res => setStudies(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchStudies()
  }, [])

  //mark done
  const handleDone = (id) => {
    axios.put(`http://localhost:3001/update/${id}`)
      .then(() => fetchStudies())
      .catch(err => console.log(err))
  }

  //delete task
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => fetchStudies())
      .catch(err => console.log(err))
  }

  //DRAG AND DROP 
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedItemIndex', index)
  }

  const handleDragOver = (e) => {
    e.preventDefault() //for drop
  }

  const handleDrop = (e, dropIndex) => {
    const draggedItemIndex = e.dataTransfer.getData('draggedItemIndex')
    if (draggedItemIndex === '' || draggedItemIndex === dropIndex.toString()) return

    const newStudies = [...studies]
    const draggedItem = newStudies[draggedItemIndex]
    
    //DRAGS
    newStudies.splice(draggedItemIndex, 1)     //remove from old position

    newStudies.splice(dropIndex, 0, draggedItem)     //insert at new position

    setStudies(newStudies)
  }

  return (
    <div className='home-container'>
      
      {/* Left side: Study list */}
      <div className='study-container'>
        <h1>Pomodoro Study Planner</h1>
        <Create onSuccess={fetchStudies} />

        {studies.length > 1 && ( //conditional rendering!!
          <h2>Drag Study Tasks To Change Position</h2>
        )}

        {studies.length === 0 ? (
          <div className='noRecText'> No Record (Enter Something to Study)</div>
        ) : (
          studies.map((study, index) => (
            <div
              key={study._id}
              className='task'
              draggable
              onDragStart={ (e)  => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e)=> handleDrop(e, index)}
            >
              <div onClick={ () => handleDone(study._id)}>
                {study.done ? <BsFillCheckCircleFill /> : <BsCircle />}
                <span className = {study.done ? 'line-through' : ''}>
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
      
      {/* Right side: Pomodoro clock */}
      <Pomodoro />

    </div>
  )
}

export default Home
