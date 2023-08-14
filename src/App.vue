<template>
  <div id="cubeContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import config from './config.json';

import GridGroup from './GridGroup.js';

export default {
  name: 'Cube',
  mounted() {
    const scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 50;

    const camera = new THREE.OrthographicCamera(- 3*aspect,  3*aspect, 3, -3, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    document.getElementById('cubeContainer').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf056b1, transparent: true, opacity: 0.5 });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 1;

    /* REMARK: Вот так можно привязать сетку к камере */
    const gridGroup = new GridGroup(config);
    camera.add(gridGroup);

    scene.add(camera);

    gridGroup.rescale(frustumSize)

    const controls = new OrbitControls( camera, renderer.domElement );

    controls.update();

    document.addEventListener('wheel', function (e) {
        // TODO: здесь прописать условия рескейлинга сетки
    });

    const animate = function () {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();

}, }; </script>

// <style> #cubeContainer { width: 100%; height: 100%; } </style>
