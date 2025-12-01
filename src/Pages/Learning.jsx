import React, { useState, useEffect, useRef } from 'react';
import LearningComponent from '../Components/Learning/LearningComponent';
import BoxyBody from '../Components/Learning/BoxyBody';
import './CSS/Learning.css';

const Learning = () => {
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

  const goBack = () => {
    if (step === 'userGender') setStep('selectMode');
    else if (step === 'touchByType') setStep('userGender');
    else if (step === 'bodyLearning') setStep('touchByType');
    else if (step === 'objects') setStep('selectMode');
  };

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
    boy: {
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

  // const learningItems = [
  //   ...object learning items (commented out for now)
  // ];

  const playClick = () => {
    const audio = new Audio('/button_click.mp3');
    audio.play().catch(() => {});
  };

  const cardContent = {
    'objects learning': { icon: '📚', desc: 'Learn about objects representing safe and unsafe touch.' },
    'body parts learning': { icon: '🧍', desc: 'Understand body parts and touch awareness.' },
    
    man: { icon: '👨', desc: 'Explore body safety for men.' },
    woman: { icon: '👩', desc: 'Explore body safety for women.' },
    boy: { icon: '👦', desc: 'Body safety with a boy model.' },
    girl: { icon: '👧', desc: 'Understand safe zones for young girls.' },
    
    'touch by man': { icon: '👨', desc: 'Learn about touch scenarios with men.' },
    'touch by woman': { icon: '👩', desc: 'Learn about touch scenarios with women.' },
  };

  const renderCards = (options, onClick, showBack = true) => (
    <div className="modal">
      {showBack && (
        <button className="modal-back" onClick={goBack}>
          ← Back
        </button>
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
              <div className="modal-icon">{content.icon || '🧠'}</div>
              <div className="modal-label">{label}</div>
              <div className="modal-desc">{content.desc || ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (step === 'selectMode') {
    // Show both Body Parts and Objects learning options
    return renderCards(['Body Parts Learning', 'Objects Learning'], (choice) => {
      if (choice.toLowerCase().includes('objects')) {
        setStep('objects');
      } else {
        setStep('userGender');
      }
    }, false);
  }

  if (step === 'userGender') {
    return renderCards(['Girl', 'Boy'], (selectedGender) => {
      setUserGender(selectedGender);
      setStep('touchByType');
    });
  }

  if (step === 'touchByType') {
    // Show only Touch by Man and Touch by Woman
    const options = ['Touch by Man', 'Touch by Woman'];
    return renderCards(options, (selectedTouchType) => {
      setTouchByType(selectedTouchType);
      setStep('bodyLearning');
    });
  }

  if (step === 'objects') {
    // Provide a small set of object models to learn from
    const learningItems = [
      { title: 'Apple', touch: 'good', path: '/Models/Apple.glb', description: 'Apples are healthy and safe to touch.' },
      { title: 'Teddy Bear', touch: 'good', path: '/Models/Teddy Bear.glb', description: 'Teddy bears are comforting toys.' },
      { title: 'Book', touch: 'good', path: '/Models/Book.glb', description: 'Books are fun and safe to hold.' },
      { title: 'Knife', touch: 'bad', path: '/Models/Knife.glb', description: 'Knives are sharp and dangerous.' }
    ];

    return <LearningComponent dataList={learningItems} onBack={goBack} />;
  }

  // Two-step learning: tutorial -> interactive identification -> normal learning
  if (step === 'bodyLearning' && touchByType && userGender) {
    let bodyType = userGender === 'girl' ? 'girl' : 'boy';
    let subtype = 'stranger';
    const props = bodyLearning[bodyType];

    // Show tutorial first: highlights private areas and explains
    return (
      <BoxyBody
        image_path={props.image_path}
        cssName={props.cssName}
        type={props.type}
        subtype={subtype}
        touchByType={touchByType}
        tutorial={true}
        onContinue={() => setStep('interactiveTest')}
        onBack={goBack}
      />
    );
  }

  if (step === 'interactiveTest' && touchByType && userGender) {
    let bodyType = userGender === 'girl' ? 'girl' : 'boy';
    let subtype = 'stranger';
    const props = bodyLearning[bodyType];

    return (
      <BoxyBody
        image_path={props.image_path}
        cssName={props.cssName}
        type={props.type}
        subtype={subtype}
        touchByType={touchByType}
        identifyMode={true}
        maxAttempts={10}
        onBack={goBack}
      />
    );
  }

  return null;
};

export default Learning;
