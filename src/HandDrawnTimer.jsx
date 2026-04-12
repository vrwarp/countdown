import React, { useState, useEffect, useRef } from 'react';

export default function HandDrawnTimer() {
  const [inputHours, setInputHours] = useState('00');
  const [inputMinutes, setInputMinutes] = useState('08');
  const [inputSeconds, setInputSeconds] = useState('12');

  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('setup'); // 'setup', 'running', 'paused', 'finished'

  // Handle countdown logic
  useEffect(() => {
    let intervalId;
    if (isRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setMode('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, remainingTime]);

  const startTimer = () => {
    if (mode === 'setup') {
      const totalSeconds =
        (parseInt(inputHours || 0, 10) * 3600) +
        (parseInt(inputMinutes || 0, 10) * 60) +
        parseInt(inputSeconds || 0, 10);

      if (totalSeconds > 0) {
        setRemainingTime(totalSeconds);
        setIsRunning(true);
        setMode('running');
      }
    } else if (mode === 'paused') {
      setIsRunning(true);
      setMode('running');
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setMode('paused');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingTime(0);
    setMode('setup');
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0')
    };
  };

  const handleInput = (e, setter, max) => {
    let val = e.target.value.replace(/\D/g, ''); // Only numbers
    if (val.length > 2) val = val.slice(1);
    if (parseInt(val, 10) > max) val = String(max);
    setter(val);
  };

  const displayTime = mode === 'setup'
    ? { h: inputHours.padStart(2, '0'), m: inputMinutes.padStart(2, '0'), s: inputSeconds.padStart(2, '0') }
    : formatTime(remainingTime);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 paper-bg text-charcoal relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Fredericka+the+Great&display=swap');

        .paper-bg {
          background-color: #f4f1ea;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }

        .text-charcoal {
          color: #2c2c2c;
        }

        .font-sketch-numbers {
          font-family: 'Fredericka the Great', cursive;
        }

        .font-sketch-ui {
          font-family: 'Caveat', cursive;
        }

        .sketch-border {
          border: 3px solid #2c2c2c;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          background: transparent;
          transition: all 0.2s ease;
        }

        .sketch-border:hover:not(:disabled) {
          border-radius: 15px 225px 15px 255px/255px 15px 225px 15px;
          transform: scale(1.02);
        }

        .sketch-border:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sketch-input {
          border-bottom: 3px solid #2c2c2c;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          background: transparent;
          text-align: center;
          outline: none;
        }

        .sketch-input:focus {
           background: rgba(0,0,0,0.03);
        }

        /* The little action lines from the image */
        .action-lines::before {
          content: "\\\\";
          position: absolute;
          top: -20px;
          right: 30px;
          font-size: 2rem;
          transform: rotate(-15deg);
        }
        .action-lines::after {
          content: "/";
          position: absolute;
          top: -15px;
          right: 5px;
          font-size: 2rem;
          transform: rotate(20deg);
        }

        .wiggle {
          animation: wiggle 0.5s ease-in-out infinite alternate;
        }

        @keyframes wiggle {
          0% { transform: rotate(-1deg); }
          100% { transform: rotate(1deg); }
        }
      `}} />

      {/* Main Timer Display */}
      <div className={`relative flex items-end justify-center mb-12 ${mode === 'finished' ? 'wiggle' : ''}`}>
        <span className="font-sketch-numbers text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-8 mr-2">“</span>

        <div className="flex items-center text-7xl sm:text-9xl md:text-[12rem] leading-none font-sketch-numbers tracking-tight relative">

          {mode === 'setup' ? (
            <>
              <input
                type="text"
                value={inputHours}
                onChange={(e) => handleInput(e, setInputHours, 99)}
                className="w-24 sm:w-32 md:w-48 sketch-input text-charcoal placeholder-gray-400 tracking-widest pl-2"
                placeholder="00"
              />
              <span className="pb-4 mx-1 sm:mx-2">:</span>
              <input
                type="text"
                value={inputMinutes}
                onChange={(e) => handleInput(e, setInputMinutes, 59)}
                className="w-24 sm:w-32 md:w-48 sketch-input text-charcoal tracking-widest pl-2"
                placeholder="00"
              />
              <span className="pb-4 mx-1 sm:mx-2">:</span>
              <input
                type="text"
                value={inputSeconds}
                onChange={(e) => handleInput(e, setInputSeconds, 59)}
                className="w-24 sm:w-32 md:w-48 sketch-input text-charcoal tracking-widest pl-2"
                placeholder="00"
              />
            </>
          ) : (
            <>
              <div className="flex justify-center w-24 sm:w-32 md:w-48">
                <span className="inline-block w-1/2 text-center">{displayTime.h[0]}</span>
                <span className="inline-block w-1/2 text-center">{displayTime.h[1]}</span>
              </div>
              <span className="pb-4 mx-1 sm:mx-2">:</span>
              <div className="flex justify-center w-24 sm:w-32 md:w-48">
                <span className="inline-block w-1/2 text-center">{displayTime.m[0]}</span>
                <span className="inline-block w-1/2 text-center">{displayTime.m[1]}</span>
              </div>
              <span className="pb-4 mx-1 sm:mx-2">:</span>
              <div className="relative flex justify-center w-24 sm:w-32 md:w-48">
                <span className="inline-block w-1/2 text-center">{displayTime.s[0]}</span>
                <span className="inline-block w-1/2 text-center">{displayTime.s[1]}</span>
                {isRunning && <div className="action-lines text-charcoal font-sketch-ui font-bold"></div>}
              </div>
            </>
          )}

        </div>

        <span className="font-sketch-numbers text-6xl sm:text-8xl md:text-9xl mb-[-1rem] sm:mb-[-2rem] ml-2 transform rotate-180">“</span>
      </div>

      {/* Controls */}
      <div className="flex gap-6 font-sketch-ui text-3xl sm:text-4xl">
        {mode === 'setup' || mode === 'paused' ? (
          <button
            onClick={startTimer}
            className="sketch-border px-8 py-2 hover:bg-black/5"
          >
            {mode === 'paused' ? 'Resume' : 'Start'}
          </button>
        ) : mode === 'running' ? (
          <button
            onClick={pauseTimer}
            className="sketch-border px-8 py-2 hover:bg-black/5"
          >
            Pause
          </button>
        ) : null}

        <button
          onClick={resetTimer}
          disabled={mode === 'setup' && inputHours === '00' && inputMinutes === '00' && inputSeconds === '00'}
          className="sketch-border px-8 py-2 hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      {/* Decorative scribbles */}
      <div className="absolute bottom-8 left-8 text-charcoal opacity-50 font-sketch-ui text-2xl transform -rotate-6">
        Time is ticking...
      </div>
    </div>
  );
}
