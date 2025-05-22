import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sliderRef = useRef(null);
  const draggerRef = useRef(null);

  // Start loading + sound
  const beginExperience = () => {
    setHasStarted(true);
    const audio = new Audio('/splash_intro.mp3');
    audio.play().catch((err) => console.warn("Audio play error:", err));
  };

  // Loading simulation
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [hasStarted]);

  const handleStartGame = () => navigate('/home');

  const handleDrag = (e) => {
    if (hasStarted) return;

    const slider = sliderRef.current;
    const dragger = draggerRef.current;
    const max = slider.offsetWidth - dragger.offsetWidth;

    let clientX = e.clientX || e.touches?.[0].clientX;
    let startX = clientX - dragger.offsetLeft;

    const onMove = (moveEvent) => {
      let x = (moveEvent.clientX || moveEvent.touches?.[0].clientX) - startX;
      x = Math.max(0, Math.min(x, max));
      dragger.style.left = `${x}px`;

      if (x >= max) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        setIsComplete(true);
        beginExperience();
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);

    const stop = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchend', stop);
    };

    document.addEventListener('mouseup', stop);
    document.addEventListener('touchend', stop);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-[#06233b] via-[#0d1b2a] to-[#2b1e33] text-white px-6 relative overflow-hidden select-none">

      {/* Optional background blur glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#ff0080] blur-3xl opacity-10 top-1/4 left-[-10%] pointer-events-none"></div>
      <div className="absolute w-96 h-96 rounded-full bg-[#00ffff] blur-3xl opacity-10 bottom-1/4 right-[-10%] pointer-events-none"></div>

      {!hasStarted && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Good Touch, Bad Touch</h1>
          <p className="mb-10 text-center">Drag the toy to start the journey 💫</p>

          <div ref={sliderRef} className="relative w-72 h-14 bg-purple-300 rounded-full shadow-inner overflow-hidden">
            <div className="absolute top-1 left-1 w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center text-purple-800 font-bold text-lg shadow-lg cursor-pointer transition-all"
              ref={draggerRef}
              onMouseDown={handleDrag}
              onTouchStart={handleDrag}
            >
              🚀
            </div>
            {!isComplete && (
              <p className="absolute inset-0 flex items-center justify-center text-purple-800 font-semibold opacity-70 pointer-events-none">
                Drag to Start
              </p>
            )}
          </div>
        </>
      )}

      {hasStarted && (
        <>
          <div className="relative w-40 h-40 mt-10 group">
            <div className="absolute inset-0 rounded-full bg-purple-400 blur-2xl opacity-50 animate-ping z-0"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-100 opacity-20 animate-orbit z-0"></div>
            <div className="relative z-10 w-full h-full animate-float">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2784/2784445.png"
                alt="Animated Baby"
                className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-center mt-4">
            Good Touch, Bad Touch
          </h1>
          <p className="mt-2 text-lg text-center">
            Let's learn how to stay safe together 💖
          </p>

          <div className="w-full max-w-md mt-10">
            <div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-sm tracking-widest">
              Loading... {progress}%
            </p>
          </div>

          {progress === 100 && (
            <button
              onClick={handleStartGame}
              className="mt-6 px-6 py-2 bg-white text-purple-800 font-semibold rounded-full shadow-md hover:bg-purple-100 transition"
            >
              Let’s Start
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Splash;