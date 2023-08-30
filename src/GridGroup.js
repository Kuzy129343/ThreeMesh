import {Group} from "three";
import * as THREE from 'three';

const DEPTH = -5

export default class GridGroup extends Group {

    constructor(config) {
        /** Инициализация */
        super();

        this.config = config

    }

    
    rescale(frustumSize) {

        /*

        Проверка на степень масштаба. 
            если степень масштаба соответствует, ничего не делаем, иначе перерисовываем сетку
        Перерисовка сетки
            1) Удалить все линии, нарисованные на старом масштабе
            2) Нарисовать линии на новом масштабе
            3) В 
        */
            console.log(this.children)
        while (this.children.length > 0) {
            this.remove(this.children[0]);
        }



        // debugger

        const scale = Math.ceil(Math.log10(frustumSize));
    
        for (const name in this.config.grid) {
            const lineConfig = this.config.grid[name];
            let { divisionValue, size, color } = lineConfig;
    
            divisionValue *= Math.pow(10, scale);
    
            const lineMaterial = new THREE.LineBasicMaterial({ color: parseInt(color), linewidth: size });
    
            const verticalLinePoints = [];
            const horizontalLinePoints = [];
    
            for (let position = 0; position <= frustumSize; position += divisionValue) {
                verticalLinePoints.push(new THREE.Vector3(position, -frustumSize, DEPTH));
                verticalLinePoints.push(new THREE.Vector3(position, frustumSize, DEPTH));
    
                horizontalLinePoints.push(new THREE.Vector3(-frustumSize, position, DEPTH));
                horizontalLinePoints.push(new THREE.Vector3(frustumSize, position, DEPTH));
            }
    
            for (let position = 0; position >= -frustumSize; position -= divisionValue) {
                verticalLinePoints.push(new THREE.Vector3(position, -frustumSize, DEPTH));
                verticalLinePoints.push(new THREE.Vector3(position, frustumSize, DEPTH));
    
                horizontalLinePoints.push(new THREE.Vector3(-frustumSize, position, DEPTH));
                horizontalLinePoints.push(new THREE.Vector3(frustumSize, position, DEPTH));
            }
    
            const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
            const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);
    
            const verticalLines = new THREE.LineSegments(verticalLineGeometry, lineMaterial);
            const horizontalLines = new THREE.LineSegments(horizontalLineGeometry, lineMaterial);
    
            this.add(verticalLines);
            this.add(horizontalLines);
        }
    }
    
    

}