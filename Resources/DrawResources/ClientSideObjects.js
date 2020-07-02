const GameObject = require("./GameObjectClass.js");
const Objects = require("./TwoDimensionalObjects.js");
const VectorMath =require("../../Math/VectorMath.js");
const Victor = require("victor");

module.exports = class Particles extends GameObject{
    get velocity() {
        return this._velocity;
    }

    set velocity(value) {
        this._velocity = value;
    }

    constructor(spawnCoordinates,scale,_velocity){
        let polygonObjectList = [Objects.particles(spawnCoordinates,scale)];
        let centerPoint = VectorMath.calculateCenter(polygonObjectList);
        let objectColor = "#110dff";
        super(polygonObjectList,centerPoint,objectColor);

        this.velocity = _velocity;
        this._velocity = _velocity;
    }

  static createRandomMultipleParticles(creationCoords,rotation){

        let particleArray=[];

        for (let i = 0; i <= Math.random() * 25; i++) {
            let negotiateRotation = Victor(-rotation.x * Math.random(),-rotation.y * Math.random());
            particleArray.push(new Particles(creationCoords,1,negotiateRotation));

        }

        return particleArray;
    }
};
