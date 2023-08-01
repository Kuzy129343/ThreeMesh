import {Group, LineSegments, LineBasicMaterial, LineDashedMaterial} from "three";

export default class CurvesLine extends Group {
    constructor() {
        super();

        this.externalLine = new LineSegments()
        this.internalLine = new LineSegments()

        this.add(this.externalLine)
        this.add(this.internalLine)

        // this.externalLine.renderOrder = 1;
        this.internalLine.visible = false
        this.internalLine.renderOrder = 2;
        this.internalLine.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
    }

    setGeometry(geometry){
        this.geometry = geometry.toNonIndexed();
        this.externalLine.geometry = this.geometry
        this.internalLine.geometry = this.geometry
        this.internalLine.computeLineDistances()
        return this
    }

    setColor(color){
        this.color = color

        this.externalLine.material = new LineBasicMaterial({
            color: color,
            linewidth: devicePixelRatio*2,
        });

        this.internalLine.material = new LineDashedMaterial({
            color: color,
            dashSize: 0.01,
            gapSize: 0.01,
            linewidth: devicePixelRatio,
        });

        return this
    }

    toggleInternal(toggle){
        return this.internalLine.visible = toggle;
    }

}
