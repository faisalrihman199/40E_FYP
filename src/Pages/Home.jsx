import React, { useState, useEffect } from 'react';
import './CSS/Home.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import IntroductionModal from '../Components/Introduction/IntroductionModal';
import LoginModal from '../Components/Login/LoginModal';
import SignupModal from '../Components/Signup/SignupModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [bgAudio, setBgAudio] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("user") || false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigation = useNavigate();

  const options = [
    { title: 'Introduction', icon: '📖' },
    { title: 'Login', icon: '🔐' },
    { title: 'Learning', icon: '🎓' },
    { title: 'Game Play', icon: '🎮' },
    { title: 'Quizzes', icon: '❓' }
  ];

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

      {isLoggedIn && (
        <div className="logout-icon" onClick={() => {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          toast.info("You have been logged out.");
          navigation("/")
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

          const isLocked = !isLoggedIn && index > 1;

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
                  if (index === 0 && activeIndex === index) {
                    setShowIntroModal(true);
                  }
                  if (index === 1 && activeIndex === index) {
                    setShowLoginModal(true);
                  }
                  if (index === 2 && activeIndex === index && isLoggedIn) {
                    navigation('/learning');
                  }
                  if (index === 3 && activeIndex === index && isLoggedIn) {
                    navigation('/game');
                  }
                }}
                style={{
                  cursor:
                    (index === 0 || index === 1 || (index >= 2 && isLoggedIn)) && activeIndex === index
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
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            toast.success('Congratulations! Login Successful.');
            setIsLoggedIn(true);
            localStorage.setItem("user", true);
          }}
          setShowSignupModal={setShowSignupModal}
        />
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          setShowLoginModal={setShowLoginModal}
          onSignup={(data) => {
            console.log('User signed up:', data);
          }}
        />
      )}
    </div>
  );
};

export default Home;
