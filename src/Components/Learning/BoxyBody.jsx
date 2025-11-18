import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../Contexts/AppContext';

const touchRules = {
  Head: { safe: true, reason: "Head touches like patting are usually safe." },
  Mouth: { safe: true, reason: "Touching the mouth may be safe if consensual and friendly." },
  Neck: { safe: false, reason: "The neck is a sensitive area and usually considered private." },
  Chest: {
    safeIf: (type, subtype) => type === 'baby' || subtype === 'known',
    reason: "Touching the chest is only okay during care or with someone trusted."
  },
  Belly: {
    safeIf: (type) => type === 'baby',
    reason: "Touching the belly is okay for babies, but not appropriate for older individuals unless trusted."
  },
  'Private Part': {
    safe: false,
    reason: "Private parts should never be touched except by a doctor with permission."
  },
  Right_Arm: { safe: true, reason: "Touching arms is typically safe in friendly gestures." },
  Left_Arm: { safe: true, reason: "Touching arms is typically safe in friendly gestures." },
  Right_Hand: { safe: true, reason: "Handshakes or high-fives are friendly touches." },
  Left_Hand: { safe: true, reason: "Handshakes or high-fives are friendly touches." },
  Left_Thigh: {
    safeIf: (type, subtype) => type === 'baby',
    reason: "Touching thighs is only appropriate for babies during care."
  },
  Right_Thigh: {
    safeIf: (type, subtype) => type === 'baby',
    reason: "Touching thighs is only appropriate for babies during care."
  },
  Left_Leg: { safe: true, reason: "Legs are generally safe to touch." },
  Right_Leg: { safe: true, reason: "Legs are generally safe to touch." },
  Left_Foot: { safe: true, reason: "Feet are generally not private." },
  Right_Foot: { safe: true, reason: "Feet are generally not private." },
};

const cssClassMap = (zoneName) =>
  zoneName.replace(/_/g, '-').replace(/ /g, '-').toLowerCase();

const ImageBodyTouch = ({
  image_path = '/women.png',
  cssName = '/CSS/Woman.css',
  type = 'woman',
  subtype = 'stranger',
  game = false,
  onBack,
  touchByType = null
}) => {
  const [touched, setTouched] = useState(null);
  const [touchResult, setTouchResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [glowPosition, setGlowPosition] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const audioRef = useRef(null);
  const sessionStartTime = useRef(Date.now());
  const { logGameActivity, logLearningActivity } = useAppContext();

  // Track session and log progress on unmount
  useEffect(() => {
    return () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 60000); // in minutes
      const sessionName = game 
        ? `Body Touch Game - ${type} (${touchByType || 'general'})`
        : `Body Learning - ${type} (${touchByType || 'general'})`;
      
      if (game && attempts > 0) {
        const finalScore = Math.max(0, Math.round((correctCount / attempts) * 100));
        logGameActivity({
          gameName: sessionName,
          gameType: 'body_touch',
          score: finalScore,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          totalAttempts: attempts,
          durationMinutes: Math.max(1, sessionDuration)
        });
      } else if (!game && attempts > 0) {
        logLearningActivity({
          moduleName: sessionName,
          moduleType: 'body_parts',
          itemsViewed: attempts,
          durationMinutes: Math.max(1, sessionDuration),
          isCompleted: false
        });
      }
    };
  }, [game, type, touchByType, attempts, correctCount, wrongCount, logGameActivity, logLearningActivity]);

  // ✅ Dynamically load CSS and hide cursor over zones
  useEffect(() => {
    if (!cssName) return;

    // Load CSS dynamically if not already added
    const existing = document.querySelector(`link[href="${cssName}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssName;
      link.dataset.dynamic = "true";
      document.head.appendChild(link);
    }

    // Remove previous cursor style
    const cursorStyleId = "dynamic-cursor-style";
    const existingStyle = document.getElementById(cursorStyleId);
    if (existingStyle) existingStyle.remove();

    // Create and inject style to hide cursor over the entire body wrapper
    const style = document.createElement("style");
    style.id = cursorStyleId;
    style.innerHTML = `
      .body-wrapper {
        cursor: none !important;
      }
      .body-wrapper * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup when component unmounts
    return () => {
      const styleToRemove = document.getElementById(cursorStyleId);
      if (styleToRemove) styleToRemove.remove();
    };
  }, [cssName]);

  // Mouse tracking for custom cursor
  const handleMouseMove = (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseEnterImage = () => {
    setShowCustomCursor(true);
  };

  const handleMouseLeaveImage = () => {
    setShowCustomCursor(false);
  };

  // ✅ Handle touch evaluation
  const evaluateTouch = (zone, event) => {
    const rule = touchRules[zone];
    let isSafe = false;

    if (!rule) {
      isSafe = false;
    } else if (typeof rule.safe === 'boolean') {
      isSafe = rule.safe;
    } else if (typeof rule.safeIf === 'function') {
      isSafe = rule.safeIf(type, subtype);
    }

    const bodyWrapper = event.currentTarget.parentElement;
    const rect = bodyWrapper.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    setTouched(zone);
    setGlowPosition({ x: clickX, y: clickY });
    setTouchResult({
      safe: isSafe,
      reason: rule?.reason || "No specific rule found for this area."
    });

    // Update score in game mode
    if (game) {
      setAttempts(prev => prev + 1);
      if (isSafe) {
        setCorrectCount(prev => prev + 1);
        setScore(prev => prev + 10); // 10 points per correct answer
      } else {
        setWrongCount(prev => prev + 1);
        setScore(prev => Math.max(0, prev - 5)); // -5 points per wrong answer (min 0)
      }
    }

    // Remove glow after 2 seconds
    setTimeout(() => setGlowPosition(null), 2000);

    // Play audio in game mode
    if (game) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(isSafe ? '/correct.mp3' : '/incorrect.mp3');
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  const zones = Object.keys(touchRules);

  return (
    <div className="image-body-container">
      {onBack && (
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      )}
      
      {/* Score Display for Game Mode */}
      {game && (
        <div className="score-panel">
          <div className="score-item">
            <span className="score-label">Score:</span>
            <span className="score-value">{score} 🏆</span>
          </div>
          <div className="score-item correct">
            <span className="score-label">Correct:</span>
            <span className="score-value">{correctCount} ✅</span>
          </div>
          <div className="score-item wrong">
            <span className="score-label">Wrong:</span>
            <span className="score-value">{wrongCount} ❌</span>
          </div>
          <div className="score-item">
            <span className="score-label">Total:</span>
            <span className="score-value">{attempts}</span>
          </div>
        </div>
      )}
      
      <h2 className="learning-title">Click a Body Part</h2>

      {!imageLoaded && <div className="loader">Loading...</div>}

      <div
        className="body-wrapper"
        style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnterImage}
        onMouseLeave={handleMouseLeaveImage}
      >
        <img
          src={image_path}
          alt="Body"
          className="body-image"
          onLoad={() => setImageLoaded(true)}
        />

        {zones.map((zone, index) => (
          <div
            key={index}
            className={`zone ${cssClassMap(zone === 'Private Part' ? 'private' : zone)}`}
            onClick={(event) => evaluateTouch(zone, event)}
          />
        ))}

        {/* Click glow */}
        {glowPosition && (
          <div
            className="click-glow"
            style={{
              position: 'absolute',
              left: glowPosition.x - 15,
              top: glowPosition.y - 15,
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(0,255,255,0.4) 50%, transparent 100%)',
              boxShadow: '0 0 20px 5px rgba(0,255,255,0.6)',
              pointerEvents: 'none',
              animation: 'pulse-click 1s ease-in-out infinite alternate',
              zIndex: 10
            }}
          />
        )}
      </div>

      {/* Custom cursor overlay */}
      {showCustomCursor && (
        <div
          style={{
            position: 'fixed',
            left: mousePosition.x - 16, // Center the 32px image
            top: mousePosition.y - 16,
            width: '60px',
            height: '60px',
            backgroundImage: `url('${touchByType === 'touch by man' ? '/boy_hand.png' : '/girl_hand.png'}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        />
      )}

      {imageLoaded && touched && touchResult && (
        <p className="feedback">
          Touched: <strong>{touched}</strong> —{' '}
          {touchResult.safe ? '✅ Good' : '🚫 Bad'}
          {!game && (
            <>
              <br />
              <small>{touchResult.reason}</small>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default ImageBodyTouch;
