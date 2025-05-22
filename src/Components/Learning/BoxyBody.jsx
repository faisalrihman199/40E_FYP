import React, { useEffect, useState, useRef } from 'react';

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
  zoneName
    .replace(/_/g, '-')
    .replace(/ /g, '-')
    .toLowerCase();

const ImageBodyTouch = ({
  image_path = '/women.png',
  cssName = '/CSS/Woman.css',
  type = 'woman',
  subtype = 'stranger',
  game = false
}) => {
  const [touched, setTouched] = useState(null);
  const [touchResult, setTouchResult] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const audioRef = useRef(null);

  // Dynamically inject the CSS file
  useEffect(() => {
    if (!cssName) return;

    const existing = document.querySelector(`link[href="${cssName}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssName;
    link.dataset.dynamic = 'true';
    document.head.appendChild(link);

    return () => {
      document.querySelectorAll('link[data-dynamic]').forEach((el) => el.remove());
    };
  }, [cssName]);

  const evaluateTouch = (zone) => {
    const rule = touchRules[zone];
    let isSafe = false;

    if (!rule) {
      isSafe = false;
    } else if (typeof rule.safe === 'boolean') {
      isSafe = rule.safe;
    } else if (typeof rule.safeIf === 'function') {
      isSafe = rule.safeIf(type, subtype);
    }

    setTouched(zone);
    setTouchResult({
      safe: isSafe,
      reason: rule?.reason || "No specific rule found for this area."
    });

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
      <h2 className="learning-title">Click a Body Part</h2>

      {!imageLoaded && (
        <div className="loader">Loading...</div>
      )}

      <div className="body-wrapper" style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}>
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
            onClick={() => evaluateTouch(zone)}
          />
        ))}
      </div>

      {imageLoaded && touched && touchResult && (
        <p className="feedback">
          Touched: <strong>{touched}</strong> —{' '}
          {touchResult.safe ? '✅ Good Touch' : '🚫 Bad Touch'}
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
