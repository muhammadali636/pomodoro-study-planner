//create new study task
import React, { useState } from 'react'
import axios from 'axios'

function Create({ onSuccess }) {
  const [task, setTask] = useState('') //state--> CoV

  const handleAdd = () => {
    if (!task.trim()) return
    axios.post('http://localhost:3001/add', { task })
      .then(() => {
        onSuccess() //refresh list in parent
        setTask('')
      })
      .catch(err => console.log(err))
  }

  return ( //can only return one thing so return a single div.
    <div className='create-container'>
      <input
        type='text'
        placeholder='Enter Study Task'
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
