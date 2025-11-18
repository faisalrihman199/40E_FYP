import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';

const Splash = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppContext();
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const sliderRef = useRef(null);
  const draggerRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Start loading + sound
  const beginExperience = () => {
    setHasStarted(true);
    setShowVideo(true);
    const audio = new Audio('/splash_intro.mp3');
    audio.play().catch((err) => console.warn("Audio play error:", err));
  };

  const handleVideoComplete = () => {
    try { if (videoRef.current) videoRef.current.pause(); } catch (e) {}
    setShowVideo(false);
    setVideoLoading(true);
    // mark loading complete so the "Let's Start" button appears
    setProgress(100);
    setIsComplete(true);
  };

  const handleVideoCanPlay = () => {
    setVideoLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoading(false);
    // Auto-skip on error after 2 seconds
    setTimeout(handleVideoComplete, 2000);
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

  // autoplay the video when it becomes visible (best-effort)
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    setVideoLoading(true);
    setVideoError(false);
    const v = videoRef.current;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [showVideo]);

  const handleStartGame = () => {
    // Redirect to login instead of home
    navigate('/login');
  };

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
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#ffdde1] text-white px-6 relative overflow-hidden select-none">

      {/* Background blur glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#ff6b9d] blur-3xl opacity-30 top-1/4 left-[-10%] pointer-events-none"></div>
      <div className="absolute w-96 h-96 rounded-full bg-[#ffc1f0] blur-3xl opacity-30 bottom-1/4 right-[-10%] pointer-events-none"></div>

      {/* Floating Rainbows */}
      <div className="absolute text-8xl opacity-80 top-[15%] left-[5%] animate-bounce pointer-events-none">🌈</div>
      <div className="absolute text-7xl opacity-70 top-[60%] right-[8%] animate-pulse pointer-events-none" style={{animationDuration: '3s'}}>🌈</div>
      <div className="absolute text-6xl opacity-60 bottom-[20%] left-[10%] animate-bounce pointer-events-none" style={{animationDelay: '1s'}}>🌈</div>

      {/* Floating Clouds */}
      <div className="absolute text-6xl opacity-50 top-[25%] right-[15%] animate-float pointer-events-none">☁️</div>
      <div className="absolute text-5xl opacity-40 top-[70%] left-[20%] animate-float pointer-events-none" style={{animationDelay: '2s'}}>☁️</div>
      <div className="absolute text-7xl opacity-60 bottom-[10%] right-[20%] animate-float pointer-events-none" style={{animationDelay: '1.5s'}}>☁️</div>

      {/* Floating Stars */}
      <div className="absolute text-4xl top-[10%] right-[25%] animate-twinkle pointer-events-none">⭐</div>
      <div className="absolute text-3xl top-[45%] left-[15%] animate-twinkle pointer-events-none" style={{animationDelay: '0.5s'}}>✨</div>
      <div className="absolute text-4xl bottom-[30%] right-[30%] animate-twinkle pointer-events-none" style={{animationDelay: '1s'}}>💫</div>
      <div className="absolute text-3xl top-[80%] right-[10%] animate-twinkle pointer-events-none" style={{animationDelay: '1.5s'}}>⭐</div>

      {!hasStarted && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-pink-800">Good Touch, Bad Touch</h1>
          <p className="mb-10 text-center text-pink-700">Drag the toy to start the journey 💫</p>

          <div ref={sliderRef} className="relative w-72 h-14 bg-pink-200 rounded-full shadow-inner overflow-hidden">
            <div className="absolute top-1 left-1 w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center text-pink-600 font-bold text-lg shadow-lg cursor-pointer transition-all"
              ref={draggerRef}
              onMouseDown={handleDrag}
              onTouchStart={handleDrag}
            >
              🚀
            </div>
            {!isComplete && (
              <p className="absolute inset-0 flex items-center justify-center text-pink-700 font-semibold opacity-70 pointer-events-none">
                Drag to Start
              </p>
            )}
          </div>
        </>
      )}

      {hasStarted && (
        <>
          {showVideo ? (
            <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
              {/* Loading spinner while video buffers */}
              {videoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-70">
                  <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-lg font-semibold">Loading video...</p>
                </div>
              )}

              {/* Error message if video fails */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-70">
                  <p className="text-white text-xl font-bold mb-2">⚠️ Video Error</p>
                  <p className="text-white text-sm">Continuing in a moment...</p>
                </div>
              )}

              {/* Fullscreen video container - video covers viewport with letterboxing */}
              <video
                ref={videoRef}
                src="/videos/startup.mp4"
                className="w-full h-full object-contain"
                onEnded={handleVideoComplete}
                onCanPlay={handleVideoCanPlay}
                onLoadedData={handleVideoCanPlay}
                onError={handleVideoError}
                onWaiting={() => setVideoLoading(true)}
                onPlaying={() => setVideoLoading(false)}
                playsInline
                controls={false}
                preload="auto"
                aria-label="Startup video"
              />

              {/* Attractive Skip button positioned bottom-right like an ad */}
              <div className="absolute bottom-6 right-6 z-60">
                <button
                  onClick={handleVideoComplete}
                  className="flex items-center gap-3 bg-white bg-opacity-95 text-pink-600 font-extrabold px-4 py-2 rounded-full shadow-2xl border-2 border-pink-200 hover:scale-105 transform transition-all"
                  style={{backdropFilter: 'blur(6px)'}}
                >
                  <span className="text-sm">Skip</span>
                  <span className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">✕</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-40 h-40 mt-10 group">
                <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-50 animate-ping z-0"></div>
                <div className="absolute inset-0 rounded-full border-4 border-pink-100 opacity-20 animate-orbit z-0"></div>
                <div className="relative z-10 w-full h-full animate-float">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2784/2784445.png"
                    alt="Animated Baby"
                    className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-in-out"
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-center mt-4 text-pink-800">
                Good Touch, Bad Touch
              </h1>
              <p className="mt-2 text-lg text-center text-pink-700">
                Let's learn how to stay safe together 💖
              </p>

              <div className="w-full max-w-md mt-10">
                <div className="w-full bg-pink-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-100 ease-linear"
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
                  className="mt-6  bg-white text-pink-600 font-semibold rounded-full shadow-md hover:bg-pink-50 transition"
                >
                  <span style={{margin:"20px"}} >
                    Let's Start
                  </span>
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Splash;