import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';
import './CSS/Game.css';

const learningItems = [
  {
    title: "Apple",
    touch: "good",
    path: "/Models/Apple.glb",
    description: "Apples represent health and care."
  },
  {
    title: "Knife",
    touch: "bad",
    path: "/Models/Knife.glb",
    description: "Knives are sharp and dangerous."
  },
  {
    title: "Teddy Bear",
    touch: "good",
    path: "/Models/Teddy Bear.glb",
    description: "A teddy bear offers comfort and love."
  }
];

const Loader = () => (
  <div className="model-loader">
    <div className="spinner" />
    <p>Loading...</p>
  </div>
);

const ModelViewer = ({ path, onLoad }) => {
  const gltf = useLoader(GLTFLoader, path);
  const { scene } = gltf;
  const ref = useRef();
  const controls = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!ref.current || !scene) return;
    while (ref.current.children.length > 0) {
      ref.current.remove(ref.current.children[0]);
    }

    const model = scene.clone();
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxAxis;

    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    ref.current.add(model);

    camera.position.set(0, 1, 3);
    controls.current?.reset();
    requestAnimationFrame(() => onLoad?.());
  }, [path]);

  return (
    <>
      <group ref={ref} />
      <OrbitControls ref={controls} enableZoom={true} maxDistance={10} minDistance={1} />
    </>
  );
};

const TouchGame = () => {
  const navigate = useNavigate();
  const { logGameActivity } = useAppContext();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const sessionStartTime = useRef(Date.now());

  const currentItem = learningItems[index];

  // Log game session on unmount
  useEffect(() => {
    return () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 60000);
      const totalAttempts = correctAnswers + wrongAnswers;
      
      if (totalAttempts > 0) {
        logGameActivity({
          gameName: 'Touch Identifier Game - Objects',
          gameType: 'object_recognition',
          score: Math.round((correctAnswers / totalAttempts) * 100),
          correctAnswers,
          wrongAnswers,
          totalAttempts,
          durationMinutes: Math.max(1, sessionDuration)
        });
      }
    };
  }, [correctAnswers, wrongAnswers, logGameActivity]);

  const handleBack = () => {
    // Log game session before leaving
    const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 60000);
    const totalAttempts = correctAnswers + wrongAnswers;
    
    if (totalAttempts > 0) {
      logGameActivity({
        gameName: 'Touch Identifier Game - Objects',
        gameType: 'object_recognition',
        score: Math.round((correctAnswers / totalAttempts) * 100),
        correctAnswers,
        wrongAnswers,
        totalAttempts,
        durationMinutes: Math.max(1, sessionDuration)
      });
    }
    
    navigate(-1); // Go to previous page
  };

  const handleAnswer = (choice) => {
    const isCorrect = choice === currentItem.touch;
    new Audio(isCorrect ? '/correct.mp3' : '/incorrect.mp3').play();

    setFeedback(isCorrect ? 'Correct! ✅' : 'Oops! ❌');
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    setTimeout(() => {
      setFeedback('');
      setLoading(true);
      setIndex((prev) => (prev + 1) % learningItems.length);
    }, 1000);
  };

  return (
    <div className="touchgame-container">
      <button className="back-button-game" onClick={handleBack}>
        ← Back
      </button>
      <div className="touchgame-header">
        <h2>Touch Identifier Game</h2>
        <p>Score: {score}</p>
      </div>

      <div className="model-box">
        {loading && <Loader />}
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <Suspense fallback={null}>
            <ModelViewer path={currentItem.path} onLoad={() => setLoading(false)} />
          </Suspense>
        </Canvas>
      </div>

      <div className="touchgame-description">
        <h3>{currentItem.title}</h3>
        <p>{currentItem.description}</p>
        {feedback && <p className="feedback">{feedback}</p>}
      </div>

      <div className="touchgame-buttons">
        <button className="good" onClick={() => handleAnswer('good')}>✅ Good</button>
        <button className="bad" onClick={() => handleAnswer('bad')}>❌ Bad</button>
      </div>
    </div>
  );
};

export default TouchGame;
