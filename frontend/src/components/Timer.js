import React, { useState, useEffect } from 'react';
import './Timer.css'; // Add styling for the timer

function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isTimeCritical, setIsTimeCritical] = useState(false); // Flag for critical time
  const [showMessage, setShowMessage] = useState(false); // Flag for popup message

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft <= 120) {
      setIsTimeCritical(true); // Mark time as critical when it's less than 2 minutes (120 seconds)
      setShowMessage(true); // Show the popup message when time is critical
    }

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer-container">
      <div className={`timer ${isTimeCritical ? 'critical' : ''}`}>
        Time Left: {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>

      {showMessage && (
        <div className="time-critical-message">
          <strong>Warning:</strong> Only 2 minutes left!
        </div>
      )}
    </div>
  );
}

export default Timer;
