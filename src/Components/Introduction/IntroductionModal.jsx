import React, { useState, useEffect } from 'react';
import './IntroductionModal.css';

const IntroductionModal = ({ onClose }) => {
  const lines = [
    "Welcome to the Good Touch & Bad Touch Game",
    "In this fun and safe space, you'll learn about good touches and bad touches. You’ll go through short lessons, exciting gameplay, and quizzes to test what you’ve learned.",
    "Remember, your body belongs to you, and it’s always okay to speak up! Let's begin this important journey together.",
    
  ];

  const [typedText, setTypedText] = useState(['', '', '']);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const currentLine = lines[lineIndex];
    const interval = setInterval(() => {
      setTypedText(prev => {
        const updated = [...prev];
        updated[lineIndex] += currentLine.charAt(charIndex);
        return updated;
      });
      setCharIndex(prev => prev + 1);
    }, 25);

    if (charIndex >= lines[lineIndex].length) {
      clearInterval(interval);
      setTimeout(() => {
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [charIndex, lineIndex]);

  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <button className="intro-close-button" onClick={onClose}>×</button>
        <h2 className="intro-title">{typedText[0]}</h2>
        <p className="intro-text">{typedText[1]}</p>
        <p className="intro-text">{typedText[2]}</p>
        <div className="intro-cta">
          <button className="intro-start-button" onClick={onClose}>Let's Begin</button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionModal;
