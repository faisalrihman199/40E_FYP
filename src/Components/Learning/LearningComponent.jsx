import React, { useState, Suspense, useRef, useEffect } from 'react';
import './Learning.css';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3 } from 'three';
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from 'react-icons/io5';

// Loader Component
const Loader = () => (
  <div className="model-loader">
    <div className="spinner" />
    <p>Loading model...</p>
  </div>
);

// Reusable ModelViewer
const ModelViewer = ({ path, onLoad }) => {
  const gltf = useLoader(GLTFLoader, path);
  const { scene } = gltf;
  const ref = useRef();
  const controls = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!ref.current) return;

    while (ref.current.children.length > 0) {
      ref.current.remove(ref.current.children[0]);
    }

    const model = scene.clone();
    const box = new Box3().setFromObject(model);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxAxis;

    model.scale.setScalar(scale);
    model.position.set(0, 0, 0);
    model.position.sub(center.multiplyScalar(scale));
    ref.current.add(model);

    camera.position.set(0, 1, 3);
    controls.current?.reset();

    requestAnimationFrame(() => onLoad?.());
  }, [path]);

  return (
    <>
      <group ref={ref} />
      <OrbitControls ref={controls} enableZoom={true} maxDistance={100} minDistance={0.5} />
    </>
  );
};

const LearningComponent = ({ dataList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const data = dataList[currentIndex];

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev + 1) % dataList.length);
  };

  const handlePrevious = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? dataList.length - 1 : prev - 1));
  };

  return (
    <div className="learning-page">
      <h2 className="learning-title">{data.title}</h2>
      <div className={`touch-type ${data.touch}`}>
        {data.touch === 'good' ? '✅ Good Touch' : '❌ Bad Touch'}
      </div>

      <p className="learning-description">{data.description}</p>

      <div className="model-container">
        {loading && <Loader />}
        <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <Suspense fallback={null}>
            <ModelViewer path={data.path} onLoad={() => setLoading(false)} />
          </Suspense>
        </Canvas>
      </div>

      <div className="learning-nav-buttons">
        <button className="nav-button glowing-button" onClick={handlePrevious}>
          <IoChevronBackCircleOutline size={30} />
        </button>
        <button className="nav-button glowing-button" onClick={handleNext}>
          <IoChevronForwardCircleOutline size={30} />
        </button>
      </div>
    </div>
  );
};

export default LearningComponent;
