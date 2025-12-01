import React, { useState, useEffect, useRef } from 'react';
import './CSS/Home.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import IntroductionModal from '../Components/Introduction/IntroductionModal';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';

const Home = () => {
  const { user, logout } = useAppContext();
  const [bgAudio, setBgAudio] = useState(null);
  const isLoggedIn = !!user;
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showLearningVideo, setShowLearningVideo] = useState(false);
  const [learningVideoLoading, setLearningVideoLoading] = useState(true);
  const [learningVideoError, setLearningVideoError] = useState(false);

  const learningVideoRef = useRef(null);
  const [learningIsPlaying, setLearningIsPlaying] = useState(false);
  const navigation = useNavigate();

  const baseOptions = [
    { title: 'Introduction', icon: '📖' },
    { title: 'Login', icon: '🔐' },
    { title: 'Learning', icon: '🎓' },
    { title: 'Game Play', icon: '🎮' },
    { title: 'Parental Control', icon: '👨‍👩‍👧‍👦' }
  ];

  // Filter out Login option when user is logged in
  const options = isLoggedIn 
    ? baseOptions.filter(option => option.title !== 'Login')
    : baseOptions;

  const [activeIndex, setActiveIndex] = useState(1);
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const fullText = `Explore the journey of understanding safe and unsafe touch through fun learning, interactive gameplay, and engaging quizzes designed just for kids.${isLoggedIn ? '' : '\n(Login to Activate Your Locked Features)'}`;

    const audio = new Audio('/home_intro.mp3');
    audio.loop = true;
    audio.play().catch((err) => console.warn("Audio autoplay blocked:", err));
    setBgAudio(audio);

    let i = 0;
    const typingSpeed = 30;
    setTypedText('');
    const typeInterval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(typeInterval);
        setTypingDone(true);
      }
    }, typingSpeed);

    return () => {
      clearInterval(typeInterval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isLoggedIn]);

  const playClick = () => {
    const click = new Audio('/button_click.mp3');
    click.play();
  };

  const rotateLeft = () => {
    if (bgAudio) {
      bgAudio.volume = 0.2;
      setTimeout(() => { bgAudio.volume = 1; }, 1000);
    }
    playClick();
    setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
  };

  const rotateRight = () => {
    if (bgAudio) {
      bgAudio.volume = 0.2;
      setTimeout(() => { bgAudio.volume = 1; }, 1000);
    }
    playClick();
    setActiveIndex((prev) => (prev + 1) % options.length);
  };

  return (
    <div className="home-screen">
      <div className="blur-glow pink"></div>
      <div className="blur-glow cyan"></div>

      {/* Floating Rainbows */}
      <div className="absolute text-7xl opacity-70 top-[10%] left-[5%] animate-bounce pointer-events-none" style={{animationDuration: '4s'}}>🌈</div>
      <div className="absolute text-6xl opacity-60 top-[15%] right-[8%] animate-float pointer-events-none">🌈</div>
      <div className="absolute text-8xl opacity-75 bottom-[15%] left-[10%] animate-pulse pointer-events-none" style={{animationDuration: '3s'}}>🌈</div>
      <div className="absolute text-7xl opacity-65 bottom-[20%] right-[12%] animate-bounce pointer-events-none" style={{animationDelay: '1s'}}>🌈</div>

      {/* Floating Clouds */}
      <div className="absolute text-6xl opacity-50 top-[30%] left-[8%] animate-float pointer-events-none" style={{animationDelay: '1s'}}>☁️</div>
      <div className="absolute text-5xl opacity-40 top-[25%] right-[15%] animate-float pointer-events-none" style={{animationDelay: '2s'}}>☁️</div>
      <div className="absolute text-7xl opacity-55 bottom-[30%] right-[5%] animate-float pointer-events-none">☁️</div>
      <div className="absolute text-6xl opacity-45 bottom-[35%] left-[15%] animate-float pointer-events-none" style={{animationDelay: '1.5s'}}>☁️</div>

      {/* Sparkles and Stars */}
      <div className="absolute text-4xl top-[20%] left-[25%] animate-twinkle pointer-events-none">⭐</div>
      <div className="absolute text-3xl top-[50%] right-[20%] animate-twinkle pointer-events-none" style={{animationDelay: '0.5s'}}>✨</div>
      <div className="absolute text-4xl bottom-[40%] left-[30%] animate-twinkle pointer-events-none" style={{animationDelay: '1s'}}>💫</div>
      <div className="absolute text-3xl top-[60%] left-[20%] animate-twinkle pointer-events-none" style={{animationDelay: '1.5s'}}>⭐</div>
      <div className="absolute text-4xl bottom-[50%] right-[25%] animate-twinkle pointer-events-none" style={{animationDelay: '0.8s'}}>✨</div>

      {isLoggedIn && (
        <div className="logout-icon" onClick={async () => {
          try {
            await logout();
            toast.info("You have been logged out.");
            navigation("/login");
          } catch (error) {
            toast.error("Logout failed. Please try again.");
          }
        }}>
          🔓 Logout
        </div>
      )}

      <h1 className="home-title">Main Menu</h1>
      <p className="home-subtitle">
        {typedText}
        {!typingDone && <span className="blinking-cursor">|</span>}
      </p>

      <div className="heading-underline"></div>

      <div className="carousel">
        {options.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const scale = 1 - absOffset * 0.1;
          const zIndex = 10 - absOffset;
          const rotateY = offset * 60;
          const translateZ = -absOffset * 100;

          // Get the original index for proper action handling
          const originalIndex = isLoggedIn && item.title !== 'Introduction' 
            ? baseOptions.findIndex(option => option.title === item.title)
            : index;

          const isLocked = !isLoggedIn && originalIndex > 1;

          return (
            <div
              key={index}
              className={`carousel-card${index === activeIndex ? ' active' : ''}`}
              style={{
                transform: `translateX(${offset * 200}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex
              }}
            >
              <div
                className={`card-glow${isLocked ? ' locked' : ''}`}
                onClick={() => {
                  if (originalIndex === 0 && activeIndex === index) {
                    setShowIntroModal(true);
                  }
                  if (originalIndex === 1 && activeIndex === index && !isLoggedIn) {
                    navigation('/login');
                  }
                  if (originalIndex === 2 && activeIndex === index && isLoggedIn) {
                    // Show skippable learning video first, then navigate
                    setShowLearningVideo(true);
                    setLearningVideoLoading(true);
                    setLearningVideoError(false);
                  }
                  if (originalIndex === 3 && activeIndex === index && isLoggedIn) {
                    navigation('/game');
                  }
                  // Parental Control - card only (no functionality)
                }}
                style={{
                  cursor:
                    (originalIndex === 0 || (originalIndex === 1 && !isLoggedIn) || (originalIndex >= 2 && isLoggedIn)) && activeIndex === index
                      ? 'pointer'
                      : 'default'
                }}
              >
                <div className="card-icon">{item.icon}</div>
                <div className="card-title">
                  {item.title}
                  {isLocked && (
                    <div className="card-lock-tooltip">
                      🔒
                      <span className="tooltip-text">Please login to access these features</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="carousel-nav">
        <button className="nav-button glowing-button" onClick={rotateLeft}>
          <FaChevronLeft />
        </button>
        <button className="nav-button glowing-button" onClick={rotateRight}>
          <FaChevronRight />
        </button>
      </div>

      {showIntroModal && <IntroductionModal onClose={() => setShowIntroModal(false)} />}


      {/* Learning video overlay (skippable) */}
      {showLearningVideo && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          {/* Loading spinner while video buffers */}
          {learningVideoLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-70">
              <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-semibold">Loading video...</p>
            </div>
          )}

          {/* Error message if video fails */}
          {learningVideoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-70">
              <p className="text-white text-xl font-bold mb-2">⚠️ Video Error</p>
              <p className="text-white text-sm">Continuing in a moment...</p>
            </div>
          )}

          <div className="relative w-full h-full">
            <video
              ref={learningVideoRef}
              src="/videos/learning.mp4"
              className="w-full h-full object-contain"
              onEnded={() => { setShowLearningVideo(false); navigation('/learning'); }}
              onCanPlay={() => { setLearningVideoLoading(false); setLearningVideoError(false); }}
              onLoadedData={() => { setLearningVideoLoading(false); setLearningVideoError(false); }}
              onError={() => { 
                setLearningVideoError(true); 
                setLearningVideoLoading(false);
                setTimeout(() => { setShowLearningVideo(false); navigation('/learning'); }, 2000);
              }}
              onWaiting={() => setLearningVideoLoading(true)}
              onPlaying={() => { setLearningVideoLoading(false); setLearningIsPlaying(true); }}
              onPause={() => setLearningIsPlaying(false)}
              playsInline
              preload="auto"
              aria-label="Learning intro video"
              autoPlay
            />

            {/* Centered play/pause overlay for learning video (larger) */}
            {!learningVideoLoading && !learningVideoError && (
              <div className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!learningVideoRef.current) return;
                    const v = learningVideoRef.current;
                    if (v.paused) {
                      v.play().then(() => setLearningIsPlaying(true)).catch(() => setLearningIsPlaying(false));
                    } else {
                      v.pause();
                      setLearningIsPlaying(false);
                    }
                  }}
                  className="pointer-events-auto bg-white bg-opacity-95 hover:bg-opacity-100 w-20 h-20 p-6 rounded-full shadow-2xl text-pink-600 text-4xl flex items-center justify-center"
                  aria-label={learningIsPlaying ? 'Pause video' : 'Play video'}
                >
                  {learningIsPlaying ? '❚❚' : '▶'}
                </button>
              </div>
            )}
          </div>
          <div className="absolute bottom-6 right-6 z-60">
            <button
              onClick={() => { setShowLearningVideo(false); navigation('/learning'); }}
              className="flex items-center gap-3 bg-white bg-opacity-95 text-pink-600 font-extrabold px-4 py-2 rounded-full shadow-2xl border-2 border-pink-200 hover:scale-105 transform transition-all"
            >
              <span className="text-sm">Skip</span>
              <span className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
