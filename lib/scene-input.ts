import * as THREE from "three";

// Shared, non-React state so every 3D layer can react to scroll & mouse without re-renders.
export const sceneInput = {
  mouse: new THREE.Vector2(),
  smoothMouse: new THREE.Vector2(),
  scroll: 0,
  smoothScroll: 0,
};
