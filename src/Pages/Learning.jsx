import React, { useState, useEffect, useRef } from 'react';
import LearningComponent from '../Components/Learning/LearningComponent';
import BoxyBody from '../Components/Learning/BoxyBody';
import './CSS/Learning.css';

const Learning = () => {
  const [step, setStep] = useState('selectMode');
  const [subtype, setSubtype] = useState(null);
  const [type, setType] = useState(null);
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
    if (step === 'subtype') setStep('selectMode');
    else if (step === 'type') setStep('subtype');
    else if (step === 'bodyLearning') setStep('type');
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

  const learningItems = [
    // Good Touch Items
    { title: "Teddy Bear", touch: "good", path: "/Models/Teddy Bear.glb", description: "This object is considered a good touch. It brings comfort, safety, and is often associated with care." },
    { title: "Book", touch: "good", path: "/Models/Book.glb", description: "Books help children learn, grow, and feel safe. A symbol of positive education and curiosity." },
    { title: "Toy Car", touch: "good", path: "/Models/Toy Car.glb", description: "Toy cars represent fun and safe playtime — an example of a comforting experience." },
    { title: "Crayons", touch: "good", path: "/Models/Crayons.glb", description: "Crayons allow kids to express creativity in a nurturing and enjoyable way." },
    { title: "Apple", touch: "good", path: "/Models/Apple.glb", description: "Apples symbolize care and nutrition — often given by parents or teachers." },
    { title: "Hammer", touch: "bad", path: "/Models/Hammer.glb", description: "Heavy and dangerous if misused." },
    { title: "Bat (weapon)", touch: "bad", path: "/Models/Bat (weapon).glb", description: "Not meant for hurting. Misuse is dangerous." },
    { title: "Garbage Bin", touch: "bad", path: "/Models/Garbage Bin.glb", description: "Unsanitary and filled with unknown substances." },
    { title: "Poison Bottle", touch: "bad", path: "/Models/Poison Bottle.glb", description: "Highly toxic. Never touch or drink." },
    { title: "Blood", touch: "bad", path: "/Models/Blood.glb", description: "May indicate injury. Avoid direct contact and seek help." },
    { title: "Monster Hand", touch: "bad", path: "/Models/Monster Hand.glb", description: "Scary and symbolic of danger or fear." },
    { title: "Shadowy Figure", touch: "bad", path: "/Models/Shadowy Figure.glb", description: "Represents the unknown and unsafe." },
    { title: "Soccer Ball", touch: "good", path: "/Models/Soccer Ball.glb", description: "Sports promote healthy interaction and physical growth — safe and joyful." },
    { title: "Toothbrush", touch: "good", path: "/Models/Toothbrush.glb", description: "Encourages good hygiene and self-care. Always a positive daily routine." },
    { title: "Water Bottle", touch: "good", path: "/Models/Water Bottle.glb", description: "Hydration is essential for health — it’s a sign of someone caring for you." },
    { title: "School Bag", touch: "good", path: "/Models/School Bag.glb", description: "Represents education and safe learning environments." },
    { title: "Blanket", touch: "good", path: "/Models/Blanket.glb", description: "Blankets provide warmth and comfort — associated with love and care." },
    { title: "Pillow", touch: "good", path: "/Models/Pillow.glb", description: "Like blankets, pillows support restful, safe environments." },
    { title: "Ice Cream", touch: "good", path: "/Models/Ice Cream.glb", description: "Fun and comfort — a reward from someone who cares." },
    { title: "Flower", touch: "good", path: "/Models/Flower.glb", description: "Flowers often symbolize affection and friendship." },
    { title: "Balloon", touch: "good", path: "/Models/Balloon.glb", description: "A symbol of joy and celebration." },
    { title: "Guitar", touch: "good", path: "/Models/Guitar.glb", description: "Music brings peace and positivity." },
    { title: "Banana", touch: "good", path: "/Models/Banana.glb", description: "Like apples, bananas are healthy and given with care." },
    { title: "Lunchbox", touch: "good", path: "/Models/Lunchbox.glb", description: "Carries nutritious meals — always a loving gesture." },
    { title: "Photo Frame", touch: "good", path: "/Models/Photo Frame.glb", description: "Holds memories of loved ones and positive experiences." },
    { title: "Story Book", touch: "good", path: "/Models/Story Book.glb", description: "A source of imagination and learning in safe spaces." },
    { title: "Chair", touch: "good", path: "/Models/Chair.glb", description: "Part of a safe, structured environment." },
    { title: "Bed", touch: "good", path: "/Models/Bed.glb", description: "Where one rests safely — a strong comfort symbol." },
    { title: "Pen", touch: "good", path: "/Models/Pen.glb", description: "Symbolizes learning and creativity." },
    { title: "Cap", touch: "good", path: "/Models/Cap.glb", description: "Often associated with safe outdoor play." },
    { title: "Soap", touch: "good", path: "/Models/Soap.glb", description: "Promotes cleanliness and health — a caring act." },
    { title: "Fire", touch: "bad", path: "/Models/Fire.glb", description: "Fire is dangerous and can cause serious burns. It's a bad touch and should be avoided." },
    { title: "Knife", touch: "bad", path: "/Models/Knife.glb", description: "Knives can hurt. They are not toys and represent dangerous situations." },
    { title: "Scissors", touch: "bad", path: "/Models/Scissors.glb", description: "Sharp tools like scissors can injure. They require supervision." },
    { title: "Broken Glass", touch: "bad", path: "/Models/Broken Glass.glb", description: "Can cut and cause bleeding — definitely a bad touch." },
    { title: "Electric Socket", touch: "bad", path: "/Models/Electric Socket.glb", description: "Electrocution risk. Never insert anything inside it." },
    { title: "Cigarette", touch: "bad", path: "/Models/Cigarette.glb", description: "Unhealthy and harmful — bad for your lungs and body." },
    { title: "Lighter", touch: "bad", path: "/Models/Lighter.glb", description: "Like fire, it’s a burn hazard." },
    { title: "Hot Iron", touch: "bad", path: "/Models/Hot Iron.glb", description: "Can cause burns. Never touch or play with it." },
    { title: "Syringe", touch: "bad", path: "/Models/Syringe.glb", description: "Sharp and used by professionals only. Never a toy." },
    { title: "Gun", touch: "bad", path: "/Models/Gun.glb", description: "Extremely dangerous and not for children to handle." },
    { title: "Chains", touch: "bad", path: "/Models/Chains.glb", description: "Can hurt, restrict, or trap someone — unsafe." },
    { title: "Handcuffs", touch: "bad", path: "/Models/Handcuffs.glb", description: "Can be used in scary or unsafe ways." },
    { title: "Bomb", touch: "bad", path: "/Models/Bomb.glb", description: "A symbol of danger and destruction." },
    { title: "Axe", touch: "bad", path: "/Models/Axe.glb", description: "Heavy and sharp. Not for play." },
    { title: "Needle", touch: "bad", path: "/Models/Needle.glb", description: "Can prick or hurt. Requires caution." },
    { title: "Saw", touch: "bad", path: "/Models/Saw.glb", description: "Used for cutting. Can injure easily." },
    { title: "Barbed Wire", touch: "bad", path: "/Models/Barbed Wire.glb", description: "Spiky and dangerous. Avoid contact." },
    { title: "Insect (Spider/Scorpion)", touch: "bad", path: "/Models/Insect (Spider/Scorpion).glb", description: "Can bite or sting. Best to stay away." },
  ];

  const playClick = () => {
    const audio = new Audio('/button_click.mp3');
    audio.play().catch(() => {});
  };

  const cardContent = {
    'objects learning': { icon: '📚', desc: 'Learn about objects representing safe and unsafe touch.' },
    'body parts learning': { icon: '🧍', desc: 'Understand body parts and touch awareness.' },
    stranger: { icon: '🚫', desc: 'Touch from someone unfamiliar.' },
    known: { icon: '✅', desc: 'Touch from someone familiar or trusted.' },
    man: { icon: '👨', desc: 'Explore body safety for men.' },
    woman: { icon: '👩', desc: 'Explore body safety for women.' },
    child: { icon: '👶', desc: 'Body safety with a baby model.' },
    girl: { icon: '👧', desc: 'Understand safe zones for young girls.' },
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
    return renderCards(['Objects Learning', 'Body Parts Learning'], (choice) => {
      setStep(choice === 'objects learning' ? 'objects' : 'subtype');
    }, false);
  }

  if (step === 'subtype') {
    return renderCards(['Stranger', 'Known'], (selectedSubtype) => {
      setSubtype(selectedSubtype);
      setStep('type');
    });
  }

  if (step === 'type') {
    return renderCards(['Man', 'Woman', 'Child', 'Girl'], (selectedType) => {
      setType(selectedType);
      setStep('bodyLearning');
    });
  }

  if (step === 'objects') {
    return <LearningComponent dataList={learningItems} />;
  }

  if (step === 'bodyLearning' && type && subtype) {
    const props = bodyLearning[type];
    return (
      <BoxyBody
        image_path={props.image_path}
        cssName={props.cssName}
        type={props.type}
        subtype={subtype}
      />
    );
  }

  return null;
};

export default Learning;
