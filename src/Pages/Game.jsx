import React, { useState, useEffect, useRef } from 'react';
import TouchGame from './Gaming';
import BoxyBody from '../Components/Learning/BoxyBody';
import './CSS/Learning.css'; // reuse modal styles

const Game = () => {
  const [step, setStep] = useState('selectMode');
  const [userGender, setUserGender] = useState(null); // Changed from subtype to userGender
  const [touchByType, setTouchByType] = useState(null); // Changed from type to touchByType
  const audioRef = useRef(null);
   useEffect(() => {
      audioRef.current = new Audio('/learning.mp3');
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
  
      return () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      };
    }, []);


  const bodyLearning = {
    woman: {
      image_path: '/women.png',
      cssName: '/CSS/Women.css',
      type: 'woman',
    },
    man: {
      image_path: '/man.png',
      cssName: '/CSS/Man.css',
      type: 'man',
    },
    child: {
      image_path: '/baby.webp',
      cssName: '/CSS/Baby.css',
      type: 'baby',
    },
    girl: {
      image_path: '/girl.png',
      cssName: '/CSS/Girl.css',
      type: 'girl',
    },
  };

  const goBack = () => {
    if (step === 'userGender') setStep('selectMode');
    else if (step === 'touchByType') setStep('userGender');
    else if (step === 'body') setStep('touchByType');
  };

  const playClick = () => {
    const audio = new Audio('/button_click.mp3');
    audio.play().catch(() => {});
  };

  const cardContent = {
    objects: { icon: '🧸', desc: 'Play touch game with objects.' },
    body: { icon: '🧍‍♂️', desc: 'Play touch game with body zones.' },
    'man': { icon: '👨', desc: 'Body model of a man.' },
    'woman': { icon: '👩', desc: 'Body model of a woman.' },
    'child': { icon: '👶', desc: 'Body model of a baby.' },
    'girl': { icon: '👧', desc: 'Body model of a young girl.' },
    
    'touch by man': { icon: '👨', desc: 'Play touch scenarios with men.' },
    'touch by woman': { icon: '👩', desc: 'Play touch scenarios with women.' },
  };

  const renderCards = (options, onClick, showBack = true) => (
    <div className="modal">
      {showBack && (
        <button className="modal-back" onClick={goBack}>← Back</button>
      )}
      <h2 className="modal-title">Choose an Option</h2>
      <div className="modal-cards">
        {options.map((label, index) => {
          const key = label.toLowerCase();
          const content = cardContent[key] || {};
          return (
            <div
              key={index}
              className="modal-card"
              onClick={() => {
                playClick();
                onClick(key);
              }}
            >
              <div className="modal-icon">{content.icon || '🎮'}</div>
              <div className="modal-label">{label}</div>
              <div className="modal-desc">{content.desc || ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (step === 'selectMode') {
    // Show both Body and Objects options
    return renderCards(['Body', 'Objects'], (choice) => {
      if (choice === 'objects') {
        setStep('objects');
      } else {
        setStep('userGender');
      }
    }, false);
  }

  if (step === 'userGender') {
    return renderCards(['Girl', 'Child'], (selectedGender) => {
      setUserGender(selectedGender);
      setStep('touchByType');
    });
  }

  if (step === 'touchByType') {
    // Show only Touch by Man and Touch by Woman
    const options = ['Touch by Man', 'Touch by Woman'];
    return renderCards(options, (selectedTouchType) => {
      setTouchByType(selectedTouchType);
      setStep('body');
    });
  }

  if (step === 'objects') {
    return <TouchGame />;
  }

  if (step === 'body' && touchByType && userGender) {
    // Always show the user's selected body type (girl or child)
    // The touch scenario determines if it's stranger or known
    let bodyType = userGender === 'girl' ? 'girl' : 'child';
    let subtype = 'stranger'; // Always stranger for man/woman touches

    const props = bodyLearning[bodyType];
    return (
      <BoxyBody
        image_path={props.image_path}
        cssName={props.cssName}
        type={props.type}
        subtype={subtype}
        touchByType={touchByType}
        game={true}
      />
    );
  }

  return null;
};

export default Game;
