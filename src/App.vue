<template>
  <div id="cubeContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import config from './config.json';

export default {
  name: 'Cube',
  mounted() {
    const scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10;
    const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.getElementById('cubeContainer').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf056b1, transparent: true, opacity: 0.5 });
    const cube = new THREE.Mesh(geometry, material);

    const cubeGroup = new THREE.Group();
    cubeGroup.add(cube);
    scene.add(cubeGroup);

    camera.position.z = 7;

    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

for (const size of config.grid.lineSizes) {
  const divisionValue = config.grid.divisionValues[size];
  const lineMaterial = new THREE.LineBasicMaterial({ color: parseInt(config.grid.lineColors[size]), linewidth: size });
  if (divisionValue === 0) {
    const verticalLinePoints = [new THREE.Vector3(0, -frustumSize / 2, -1), new THREE.Vector3(0, frustumSize / 2, -1)];
    const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
    const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
    gridGroup.add(verticalLine);

    const horizontalLinePoints = [new THREE.Vector3(-frustumSize * aspect / 2, 0, -1), new THREE.Vector3(frustumSize * aspect / 2, 0, -1)];
    const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
    const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
    gridGroup.add(horizontalLine);
  } else {
    for (let position = -frustumSize *2 / 2; position <= frustumSize*2  / 2; position += divisionValue) {
      const verticalLinePoints = [new THREE.Vector3(position, -frustumSize / 2, -1), new THREE.Vector3(position, frustumSize / 2, -1)];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
      const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
      gridGroup.add(verticalLine);

      if (position >= -frustumSize / 2 && position <= frustumSize / 2) {
        const horizontalLinePoints = [new THREE.Vector3(-frustumSize * aspect / 2, position, -1), new THREE.Vector3(frustumSize * aspect / 2, position, -1)];
        const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
        const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
        gridGroup.add(horizontalLine);
      }
    }
  }
}



    const controls = new OrbitControls(camera, renderer.domElement);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    document.addEventListener('mousedown', function (e) {
      isDragging = true;
    });
    
    document.addEventListener('mousemove', function (e) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      if (isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
            toRadians(deltaMove.y * 1),
            toRadians(deltaMove.x * 1),
            0,
            'XYZ'
          ));
        cubeGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, cubeGroup.quaternion);
      }

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    document.addEventListener('mouseup', function (e) {
      isDragging = false;
    });

    function toRadians(angle) {
      return angle * (Math.PI / 180);
    }

    const animate = function () {
      requestAnimationFrame(animate);

      gridGroup.lookAt(camera.position);

      renderer.render(scene, camera);
    };

    animate();

}, }; </script>

<style> #cubeContainer { width: 100%; height: 100%; } </style>
