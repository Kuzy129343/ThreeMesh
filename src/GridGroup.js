import {Group} from "three";
import * as THREE from 'three';

const DEPTH = -5

export default class GridGroup extends Group {

    constructor(config) {
        /** Инициализация */
        super();

        this.config = config

    }

    
    rescale(frustumSize){
        /** Поведение при ремасштабировании */

        for (const name in this.config.grid) {
            const lineConfig = this.config.grid[name]
            const {divisionValue, size, color} = lineConfig;

            /* TODO: Здесь нужно использовать на каждый тип линий не множество THREE.Line а ровно один  THREE.LineSegments */
            /* REMARK: Я убрал if divisionValue === 0 за ненадобностью и упростил код цикла */

            const lineMaterial = new THREE.LineBasicMaterial({ color: parseInt(color), linewidth: size });

            for (let position = 0; position <= frustumSize; position += divisionValue){
                const verticalLinePoints = [new THREE.Vector3(position, -frustumSize, DEPTH), new THREE.Vector3(position, frustumSize, DEPTH)];
                const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
                const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
                this.add(verticalLine);

                const horizontalLinePoints = [new THREE.Vector3(-frustumSize, position, DEPTH), new THREE.Vector3(frustumSize, position, DEPTH)];
                const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
                const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                this.add(horizontalLine);
            }

            for (let position = 0; position >= -frustumSize; position -= divisionValue){
                const verticalLinePoints = [new THREE.Vector3(position, -frustumSize, DEPTH), new THREE.Vector3(position, frustumSize, DEPTH)];
                const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
                const verticalLine = new THREE.Line(verticalLineGeometry, lineMaterial);
                this.add(verticalLine);

                const horizontalLinePoints = [new THREE.Vector3(-frustumSize, position, DEPTH), new THREE.Vector3(frustumSize, position, DEPTH)];
                const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
                const horizontalLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                this.add(horizontalLine);
            }


        }

    }

}