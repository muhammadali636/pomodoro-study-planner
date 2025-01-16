import React, { useState, useEffect } from 'react'

//POMODORO
function Pomodoro() {
  //def times in min.
  const [studyTime, setStudyTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)

  //time states (store time in total seconds)
  const [timeLeft, setTimeLeft] = useState(studyTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [onBreak, setOnBreak] = useState(false)

  useEffect(() => {
    let timer = null
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            //switches btw study and break
            if (!onBreak) {
              //study just ended switch to break
              return breakTime * 60
            } else {
              //break ended!!!! switch to study
              return studyTime * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, onBreak, breakTime, studyTime])

  //whenever timeLeft change decide if we switch break/study mode
  useEffect(() => {
    // NEW: If breakTime and studyTime are the same, skip toggling to prevent infinite loop
    if (studyTime === breakTime) return

    //iff timeLeft was just reset to breakTime or studyTime
    if (timeLeft === breakTime * 60 && !onBreak) {
      setOnBreak(true)
    }
    if (timeLeft === studyTime * 60 && onBreak) {
      setOnBreak(false)
    }
  }, [timeLeft, breakTime, studyTime, onBreak])

  //convert seconds to mm:ss
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  //start or pause timer
  const handleStartPause = () => {
    setIsRunning((prev) => !prev)
  }

  //resett timer to the beginning of the current session mode
  const handleReset = () => {
    setIsRunning(false)
    // If on break, reset to breakTime
    if (onBreak) {
      setTimeLeft(breakTime * 60)
    } else {
      setTimeLeft(studyTime * 60)
    }
  }

  //take care of changes to the settings inputs
  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    //rreset new times
    setTimeLeft(studyTime * 60)
    setOnBreak(false)
    setIsRunning(false)
  }

  //dec what label to show above the clock
  //1. If not running -> "PAUSE"
  //2. If running and on break -> "BREAK!"
  //3. If running and study -> "STUDY!"
  const label = isRunning 
    ? (onBreak ? 'BREAK!' : 'STUDY!') 
    : 'PAUSE'

  return (
    <div className='clock-container'>
      <div className='text-4xl font-extrabold text-blue-800'>{label}</div>
      <div className='clock'>
        {formatTime(timeLeft)}
      </div>
      <div className='timer-buttons'>
        <button onClick={handleStartPause}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      
      <form className='settings-form' onSubmit={handleSettingsSubmit}>
        <div>
          <label htmlFor='studyTime'>Study (min): </label>
          <input
            type='number'
            id='studyTime'
            min='1'
            value={studyTime}
            onChange={(e) => setStudyTime(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor='breakTime'>Break (min): </label>
          <input
            type='number'
            id='breakTime'
            min='1'
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
          />
        </div>
        <button type='submit'>Apply</button>
      </form>
    </div>
  )
}

export default Pomodoro
