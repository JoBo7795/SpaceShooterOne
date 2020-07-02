import GameObject from "./GameObjectClass.js";
import Objects from "./TwoDimensionalObjects.js";
import VectorMath from "./VectorMath.js";
import Victor from "./victor.js";

export default class Particles extends GameObject {

    get velocity() {
        return this._velocity;
    }

    set velocity(value) {
        this._velocity = value;
    }

    constructor(spawnCoordinates, scale, velocity) {

        let polygonObjectList = [Objects.particles(spawnCoordinates, scale)];
        let centerPoint = VectorMath.calculateCenter(polygonObjectList[0]);
        let objectColor = "#110dff";
        super(polygonObjectList, centerPoint, objectColor);
        this._velocity = velocity;

    }

    static createRandomMultipleParticles(creationCoords, shotRotation) {

        let particleArray = [];

        for (let i = 0; i <= Math.random() * 25; i++) {
            let velocity = Victor(-shotRotation.x * Math.random(), -shotRotation.y * Math.random());
            particleArray.push(new Particles(creationCoords, 1, velocity));

        }

        return particleArray;
    }

    updatePosition() {

        let i = 0;
        this.polygonObjectList[0].forEach(() => {

                this.polygonObjectList[0][i].x -= this.velocity.x;
                this.polygonObjectList[0][i].y -= this.velocity.y;
                i++;
        })
    }

}