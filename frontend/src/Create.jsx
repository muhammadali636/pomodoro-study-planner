//create new study task
import React, { useState } from 'react'
import axios from 'axios'

function Create({ onSuccess }) {
  const [task, setTask] = useState('')

  const handleAdd = () => {
    if (!task.trim()) return
    axios.post('http://localhost:3001/add', { task })
      .then(() => {
        onSuccess() //refresh.
        setTask('')
      })
      .catch(err => console.log(err))
  }

  return (
    <div className='create-container'>
      <input
        type='text'
        placeholder='Enter a Study Task'
        value={task}
        onChange={e => setTask(e.target.value)}
      />
      <button onClick={handleAdd}>
        Add
      </button>
    </div>
  )
}

export default Create
