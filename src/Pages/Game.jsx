import React, { useState, useEffect, useRef } from 'react';
import TouchGame from './Gaming';
import BoxyBody from '../Components/Learning/BoxyBody';
import './CSS/Learning.css'; // reuse modal styles

const Game = () => {
  const [step, setStep] = useState('selectMode');
  const [subtype, setSubtype] = useState(null);
  const [type, setType] = useState(null);
  const audioRef = useRef(null);



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
    if (step === 'subtype') setStep('selectMode');
    else if (step === 'type') setStep('subtype');
    else if (step === 'body') setStep('type');
  };

  const playClick = () => {
    const audio = new Audio('/button_click.mp3');
    audio.play().catch(() => {});
  };

  const cardContent = {
    objects: { icon: '🧸', desc: 'Play touch game with objects.' },
    body: { icon: '🧍‍♂️', desc: 'Play touch game with body zones.' },
    stranger: { icon: '🚫', desc: 'Touched by someone unfamiliar.' },
    known: { icon: '✅', desc: 'Touched by someone trusted.' },
    man: { icon: '👨', desc: 'Body model of a man.' },
    woman: { icon: '👩', desc: 'Body model of a woman.' },
    child: { icon: '👶', desc: 'Body model of a baby.' },
    girl: { icon: '👧', desc: 'Body model of a young girl.' },
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
    return renderCards(['Objects', 'Body'], (choice) => {
      setStep(choice === 'objects' ? 'objects' : 'subtype');
    }, false);
  }

  if (step === 'subtype') {
    return renderCards(['Stranger', 'Known'], (s) => {
      setSubtype(s);
      setStep('type');
    });
  }

  if (step === 'type') {
    return renderCards(['Man', 'Woman', 'Child', 'Girl'], (t) => {
      setType(t);
      setStep('body');
    });
  }

  if (step === 'objects') {
    return <TouchGame />;
  }

  if (step === 'body' && type && subtype) {
    const props = bodyLearning[type];
    return (
      <BoxyBody
        image_path={props.image_path}
        cssName={props.cssName}
        type={props.type}
        subtype={subtype}
        game={true}
      />
    );
  }

  return null;
};

export default Game;
