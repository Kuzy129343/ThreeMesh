<template>
  <div id="cubeContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 3 });
    const lines = new THREE.LineSegments(edges, lineMaterial);

    
cube.add(lines);

const cubeGroup = new THREE.Group();
cubeGroup.add(cube);
scene.add(cubeGroup);

    camera.position.z = 7;

    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

const MAX_X = 30;
const MAX_Y = 30;

const addLine = (x1, y1, x2, y2, color, group) => {
    const points = [new THREE.Vector3(x1, y1, -1), new THREE.Vector3(x2, y2, -1)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), MAX_X),
        new THREE.Plane(new THREE.Vector3(1, 0, 0), MAX_X),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), MAX_Y),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), MAX_Y)
    ];
    const lineMaterial = new THREE.LineBasicMaterial({ color: color, clippingPlanes: clippingPlanes });
    const line = new THREE.Line(geometry, lineMaterial);
    group.add(line);
};

const addLines = (step, color) => {
    for (let i = -MAX_Y; i <= MAX_Y; i += step) {
        addLine(-MAX_X , i + step /2 , MAX_X , i + step /2 , color , gridGroup ,0.5);
    }

    for (let i = -MAX_X; i <= MAX_X; i += step) {
        addLine(i + step /2 , -MAX_Y , i + step /2 , MAX_Y , color , gridGroup ,0.5);
    }
}

const createGrid = (size, divisions) => {
    while (gridGroup.children.length > 0) {
        gridGroup.remove(gridGroup.children[0]);
    }

    const zoom = camera.zoom;

    let step = size / divisions;
    let color = 0x00FF00;

    let halfColor = color;

    let zoomLevel = zoom >=1.5 ?1.5:1;

    while(zoom >= zoomLevel){
        addLines(step, halfColor);

        if(zoom >= zoomLevel *2){
            gridGroup.children.forEach((child) => {
                if(child.material.color.getHex() === halfColor){
                    child.material.color.setHex(color);
                }
            });

            step /=2;

            halfColor =0xFF0000;
            zoomLevel *=2;
        } else {
            break;
        }

}

for (let i = -MAX_Y; i <= MAX_Y; i += size / divisions) {
        addLine(-MAX_X,i,MAX_X,i,color,gridGroup);
}

for (let i = -MAX_X; i <= MAX_X; i += size / divisions) {
        addLine(i,-MAX_Y,i,MAX_Y,color,gridGroup);
}
};

    createGrid(30, 30);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.addEventListener('change', function () {
  createGrid(30, 30);
});

controls.addEventListener('zoom', function () {
  createGrid(30, 30);
});

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

    window.addEventListener('resize', function () {
      camera.left   = -frustumSize * aspect / 2;
      camera.right  = frustumSize * aspect / 2;
      camera.top    = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      createGrid(30, 30);
    });

}, }; </script>

<style> #cubeContainer { width: 100%; height: 100%; } </style>