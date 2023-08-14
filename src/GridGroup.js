import {Group} from "three";
import * as THREE from 'three';

export default class GridGroup extends Group {

    constructor(config) {
        /** Инициализация */
        super();

        this.config = config

    }


    scale(frustumSize){
        /** Поведение при ремасштабировании */

        for (const name in this.config.grid) {
            const lineConfig = this.config.grid[name]
            const {divisionValue, size, color} = lineConfig;


            // const lineSegment = new THREE.LineSegments()

            const lineMaterial = new THREE.LineBasicMaterial({ color: parseInt(color), linewidth: size });

            if (divisionValue === 0) {
                const verticalLinePoints = [new THREE.Vector3(0, -frustumSize / 2, -1), new THREE.Vector3(0, frustumSize / 2, -1)];
                const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
                const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
                this.add(verticalLine);
            
                const horizontalLinePoints = [new THREE.Vector3(-frustumSize / 2, 0, -1), new THREE.Vector3(frustumSize / 2, 0, -1)];
                const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
                const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                this.add(horizontalLine);
            } else {
                for (let position = -frustumSize * 2 / 2; position <= frustumSize*2  / 2; position += divisionValue) {
                    const verticalLinePoints = [new THREE.Vector3(position, -frustumSize / 2, -1), new THREE.Vector3(position, frustumSize / 2, -1)];
                    const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
                    const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
                    this.add(verticalLine);
                
                    if (position >= -frustumSize / 2 && position <= frustumSize / 2) {
                        const horizontalLinePoints = [new THREE.Vector3(-frustumSize / 2, position, -1), new THREE.Vector3(frustumSize / 2, position, -1)];
                        const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
                        const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                        this.add(horizontalLine);
                    }
                }
            }
        }

    }

}