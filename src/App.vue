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
    let frustumSize = 1;

    const camera = new THREE.OrthographicCamera(- 3*aspect,  3*aspect, 3, -3, -1000, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);

    document.getElementById('cubeContainer').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });

    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    
    const cubeEdges = new THREE.LineSegments(wireframeGeometry, edgeMaterial);

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cubeEdges)
    scene.add(cube);


    const ambientLight = new THREE.AmbientLight('#ffffff', 0.0)

    scene.add(ambientLight)

    const pointLight = new THREE.PointLight('#ffffff', 1)
    const directionLight = new THREE.DirectionalLight('#ffffff', 1)

    camera.add(pointLight)
    camera.add(directionLight)

    camera.position.z = 1;

    /* REMARK: Вот так можно привязать сетку к камере */
    const gridGroupX = new GridGroup(config, 'x');
    const gridGroupY = new GridGroup(config, 'y');
    const gridGroupZ = new GridGroup(config, 'z');
    // scene.add(gridGroupX);
    // scene.add(gridGroupY);
    camera.add(gridGroupZ);

    scene.add(camera);

    let SIZE = 3*Math.max(aspect,1)

    gridGroupX.rescale(SIZE/frustumSize)
    gridGroupY.rescale(SIZE/frustumSize)
    gridGroupZ.rescale(SIZE/frustumSize)


    const controls = new OrbitControls( camera, renderer.domElement );

    controls.update();

    document.addEventListener('wheel', function (e) {


        if (e.deltaY < 0) {
            frustumSize /= 0.95;
        } else {
            frustumSize *= 0.95;
        }

        gridGroupX.rescale(SIZE/frustumSize)
        gridGroupY.rescale(SIZE/frustumSize)
        gridGroupZ.rescale(SIZE/frustumSize)
        
    });

    const animate = function () {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();
  },
};

</script>

<style> #cubeContainer { width: 100%; height: 100%; } </style>