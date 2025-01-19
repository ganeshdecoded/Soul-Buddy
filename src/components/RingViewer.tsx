"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface RingViewerProps {
  isOpen: boolean;
  onClose: () => void;
  gemType: string;
}

export default function RingViewer({ isOpen, onClose, gemType }: RingViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Load model based on gemType
    const loader = new GLTFLoader();
    const modelPath = 
      gemType === "Blue Sapphire" ? '/ring1.glb' :
      gemType === "Black Ring" ? '/black.glb' :
      gemType === "Pearl" ? '/ring4.glb' :
      gemType === "Gold ring with a diamond" ? '/goldring.glb' : '/ring1.glb';

    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      scene.add(model);
    });

    // Animation loop
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [isOpen, gemType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <div className="absolute top-4 left-4 text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
          Drag to rotate • Scroll to zoom
        </div>

        <div className="absolute bottom-4 left-4 text-sm font-medium text-purple-600 bg-white/80 px-3 py-1 rounded-full">
          {gemType}
        </div>

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
} 