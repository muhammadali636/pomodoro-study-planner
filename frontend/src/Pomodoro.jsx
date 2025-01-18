import React, { useState, useEffect, useRef } from 'react'

//POMODORO
function Pomodoro() {
  //default times
  const [studyTime, setStudyTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  //timer states
  const [timeLeft, setTimeLeft] = useState(studyTime * 60) // Time in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [onBreak, setOnBreak] = useState(false)
  //keep track of the last time we updated the timer
  const lastUpdateTime = useRef(null)
  const timerInterval = useRef(null)
  //sounds
  const strongerAudio = new Audio('/stronger.mp3')
  const alarmAudio = new Audio('/alarm.mp3')

  //start!
  function startTimer() {
    if (!isRunning) {
      setIsRunning(true)
      lastUpdateTime.current = Date.now()

      timerInterval.current = setInterval(function () {
        const now = Date.now()
        const elapsedTime = Math.floor((now - lastUpdateTime.current) / 1000)
        lastUpdateTime.current = now

        setTimeLeft(function (prevTimeLeft) {
          const newTimeLeft = prevTimeLeft - elapsedTime
          if (newTimeLeft <= 0) {
            clearInterval(timerInterval.current)
            setIsRunning(false)
            handleSessionEnd()
            return 0
          }
          return newTimeLeft
        })
      }, 1000)
    }
  }

  //pause
  function pauseTimer() {
    setIsRunning(false)
    clearInterval(timerInterval.current)
  }

  //reset
  function resetTimer() {
    pauseTimer()
    if (onBreak) {
      setTimeLeft(breakTime * 60)
    } else {
      setTimeLeft(studyTime * 60)
    }
  }

  //handle end sessions
  function handleSessionEnd() {
    if (!onBreak) {
      strongerAudio.play()
    } 
    else {
      alarmAudio.play()
    }

    setTimeout(function () {
      if (!onBreak) {
        setOnBreak(true)
        setTimeLeft(breakTime * 60)
      } 
      else {
        setOnBreak(false)
        setTimeLeft(studyTime * 60)
      }
      startTimer()
    }, 5000) //5 sec delay
  }

  //form submission to apply new study and break times
  function handleSettingsSubmit(e) {
    e.preventDefault()
    pauseTimer()
    setTimeLeft(studyTime * 60)
    setOnBreak(false)
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <div className='clock-container'>
      <div className='text-4xl font-extrabold text-blue-800'>
        {isRunning ? (onBreak ? 'BREAK!' : 'STUDY!') : 'PAUSE'}
      </div>
      <div className='clock'>{formatTime(timeLeft)}</div>
      <div className='timer-buttons'>
        <button onClick={isRunning ? pauseTimer : startTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      <form className='settings-form' onSubmit={handleSettingsSubmit}>
        <div>
          <label htmlFor='studyTime'>Study (min): </label>
          <input
            type='number'
            id='studyTime'
            min='1'
            value={studyTime}
            onChange={function (e) {
              setStudyTime(Number(e.target.value))
            }}
          />
        </div>
        <div>
          <label htmlFor='breakTime'>Break (min): </label>
          <input
            type='number'
            id='breakTime'
            min='1'
            value={breakTime}
            onChange={function (e) {
              setBreakTime(Number(e.target.value))
            }}
          />
        </div>
        <button type='submit'>Apply</button>
      </form>
    </div>
  )
}

export default Pomodoro
