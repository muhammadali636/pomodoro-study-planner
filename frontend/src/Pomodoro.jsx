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

  // audio object
  // stronger.mp3 -> Study to Break
  // alarm.mp3 ->  Break to Study
  const strongerAudio = new Audio('/stronger.mp3')
  const alarmAudio = new Audio('/alarm.mp3')

  useEffect(function() {
    var timer = null
    if (isRunning) {
      timer = setInterval(function() {
        setTimeLeft(function(prev) {
          if (prev <= 1) {
            //switches btw study and break
            // 1) Pause timer and set timeLeft to 0
            // 2) Based on whether we're leaving a study or a break, play the correct sound
            // 3) After 5s delay, switch session and resume
            setIsRunning(false)
            setTimeLeft(0)

            if (!onBreak) {
              //study just ended, switch to break => play stronger.mp3
              strongerAudio.play().catch(function(err) {
                console.warn('stronger.mp3 failed to play:', err)
              })
            } else {
              //break just ended => play alarm.mp3
              alarmAudio.play().catch(function(err) {
                console.warn('alarm.mp3 failed to play:', err)
              })
            }

            setTimeout(function() {
              if (!onBreak) {
                //study just ended switch to break
                setOnBreak(true)
                setTimeLeft(breakTime * 60)
              } else {
                //break ended!!!! switch to study
                setOnBreak(false)
                setTimeLeft(studyTime * 60)
              }
              setIsRunning(true)
            }, 5000)

            return 0 //so it doesn't go negative
          }
          return prev - 1
        })
      }, 1000)
    }
    return function() {
      clearInterval(timer)
    }
  }, [isRunning, onBreak, breakTime, studyTime])

  //whenever timeLeft change decide if we switch break/study mode/
  useEffect(function() {
    // If timeLeft is 0, we are in the 5s transition, so skip logic
    if (timeLeft === 0) return

    //iff timeLeft was just reset to breakTime or studyTime
    //skipinh if studyTime === breakTime 
    if (studyTime === breakTime) return

    if (timeLeft === breakTime * 60 && !onBreak) {
      setOnBreak(true)
    }
    if (timeLeft === studyTime * 60 && onBreak) {
      setOnBreak(false)
    }
  }, [timeLeft, breakTime, studyTime, onBreak])

  //convert seconds to mm:ss
  function formatTime(secs) {
    var minutes = Math.floor(secs / 60)
    var seconds = secs % 60
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
  }

  //start or pause timer
  function handleStartPause() {
    setIsRunning(function(prev) {
      return !prev
    })
  }

  //resett timer to the beginning of the current session mode
  function handleReset() {
    setIsRunning(false)
    // If on break, reset to breakTime
    if (onBreak) {
      setTimeLeft(breakTime * 60)
    } else {
      setTimeLeft(studyTime * 60)
    }
  }

  //take care of changes to the settings inputs
  function handleSettingsSubmit(e) {
    e.preventDefault()
    //rreset new times
    setTimeLeft(studyTime * 60)
    setOnBreak(false)
    setIsRunning(false)
  }

  // Decide what label to show above the clock
  //not running -> "PAUSE"
  //running and on break -> "BREAK!"
  //running and study -> "STUDY!"
  var label = 'PAUSE'
  if (isRunning) {
    label = onBreak ? 'BREAK!' : 'STUDY!'
  }

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
            onChange={function(e) {
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
            onChange={function(e) {
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
