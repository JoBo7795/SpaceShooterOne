const Victor = require("victor");
const Objects = require("./TwoDimensionalObjects.js");
const VectorMath = require("../../Math/VectorMath.js");
const GameObject = require("./GameObjectClass.js");


const PlayerObject = class PlayerObject extends GameObject {
    get socketID() {
        return this._socketID;
    }

    get moveSpeed() {
        return this._moveSpeed;
    }

    set moveSpeed(value) {
        this._moveSpeed = value;
    }

    get shootPos() {
        return this._shootPos;
    }

    set shootPos(value) {
        this._shootPos = value;
    }

    get objRotation() {
        return this._objRotation;
    }

    set objRotation(value) {
        this._objRotation = value;
    }

    get rotVec() {
        return this._rotVec;
    }

    set rotVec(value) {
        this._rotVec = value;
    }

    get lifeCount() {
        return this._lifeCount;
    }

    set lifeCount(value) {
        this._lifeCount = value;
    }

    get upgrades() {
        return this._upgrades;
    }

    set upgrades(value) {
        this._upgrades = value;
    }

    constructor(socketID) {

        let scale = 0.5;
        let x = Math.floor(Math.random()*1000), y = Math.floor(Math.random()*800);

        let polygonObjectList = [Objects.leftwing(Victor(x - 5, y), scale), Objects.shipCenter(Victor(x, y), scale), Objects.rightwing(Victor(x + 95, y), scale)];
        let objectColor = ["#000000", "#ff1503", "#000000"];
        let centerPoint = VectorMath.calculateCenter(Objects.shipCenter(Victor(x, y), scale));

        super(polygonObjectList, centerPoint, objectColor);

        const objHeight = 20;

        this._moveSpeed = this._turnSpeed = 2;
        this._moveSpeed = 2;
        this._shootPos = new Victor(0, objHeight);
        this._objRotation = 0;
        this._rotVec = new Victor(0, this._moveSpeed);
        this._lifeCount = 30;
        this._upgrades = 3;
        this._socketID = socketID;
    }

    rotateRight() {
        {

            this.objRotation += this._turnSpeed;
            this.rotVec.rotate(Math.PI / 180 * this._turnSpeed);

            for (let j = 0; j < this.polygonObjectList.length; j++) {
                this.polygonObjectList[j] = VectorMath.rotatePolygon(this.polygonObjectList[j], this.centerPoint, Math.PI / 180 * this._turnSpeed);

            }

            this.shootPos.rotate(Math.PI / 180 * this._turnSpeed);

        }
    }

    rotateLeft() {

        this.objRotation -= this._turnSpeed;
        this.rotVec.rotate(Math.PI / 180 * -this._turnSpeed);

        for (let j = 0; j < this.polygonObjectList.length; j++) {
            this.polygonObjectList[j] = VectorMath.rotatePolygon(this.polygonObjectList[j], this.centerPoint, Math.PI / 180 * -this._turnSpeed);
        }

        this.shootPos.rotate(Math.PI / 180 * -this._turnSpeed);
    }

    moveUp(windowHeight, windowWidth) {
        // if-Abfrage prüft, ob der nächste addierte Vector außerhalb des Spielfelds landet
        if (this.centerPoint.y - this.rotVec.y > 0 && this.centerPoint.y - this.rotVec.y < windowHeight &&
            this.centerPoint.x - this.rotVec.x > 0 && this.centerPoint.x - this.rotVec.x < windowWidth) {

            for (let j = 0; j < this.polygonObjectList.length; j++) {
                this.polygonObjectList[j] = VectorMath.transformPolygon(this.polygonObjectList[j], VectorMath.negotiateVector(this.rotVec));
            }
            this.centerPoint = VectorMath.transformVector(this.centerPoint, VectorMath.negotiateVector(this.rotVec));
        }
    }

    moveDown(windowHeight, windowWidth) {

        if (this.centerPoint.y + this.rotVec.y > 0 && this.centerPoint.y + this.rotVec.y < windowHeight &&
            this.centerPoint.x + this.rotVec.x > 0 && this.centerPoint.x + this.rotVec.x < windowWidth) {

            for (let j = 0; j < this.polygonObjectList.length; j++) {
                this.polygonObjectList[j] = VectorMath.transformPolygon(this.polygonObjectList[j], this.rotVec);
            }
            this.centerPoint = VectorMath.transformVector(this.centerPoint, this.rotVec);

        }
    }

    middleShotPosition() {
        return Victor(this.centerPoint.x - this.shootPos.x * 3, this.centerPoint.y - this.shootPos.y * 3)
    }

    leftShotPosition() {
        return Victor(this.polygonObjectList[0][0].x, this.polygonObjectList[0][0].y);
    }

    rightShotPosition() {
        return Victor(this.polygonObjectList[2][0].x, this.polygonObjectList[2][0].y);
    }

};

class ShotObject extends GameObject {
    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }

    get shootRot() {
        return this._shootRot;
    }

    set shootRot(value) {
        this._shootRot = value;
    }

    constructor(polygonObjectList, objectColor, centerPoint, speed, movementVector) {

        super(polygonObjectList, objectColor, centerPoint);

        this._speed = speed;
        this._shootRot = {x: movementVector.x * this._speed, y: movementVector.y * this._speed};

    }
}

const RocketObject = class RocketObject extends ShotObject {

    constructor(spawnCoordinates, rotation, movementVector) {
        let scale = 1;
        let polygonObjectList = [VectorMath.rotatePolygon(Objects.rocket(spawnCoordinates, scale), spawnCoordinates, rotation * (Math.PI / 180))];
        let centerPoint = VectorMath.calculateCenter(Objects.rocket(spawnCoordinates, scale));
        let objectColor = "#ff0814";
        super(polygonObjectList, centerPoint, objectColor, 1, movementVector)
    }
};

const BulletObject = class BulletObject extends ShotObject {
    constructor(spawnCoordinates, rotation, movementVector) {

        let scale = 1;
        let polygonObjectList = [VectorMath.rotatePolygon(Objects.bullet(spawnCoordinates, scale), spawnCoordinates, rotation * (Math.PI / 180))];
        let objectColor = "#ffff09";
        let centerPoint = VectorMath.calculateCenter(Objects.bullet(spawnCoordinates, scale));

        super(polygonObjectList, centerPoint, objectColor, 1, movementVector)
    }
};

const UpgradeObject = class UpgradeObject extends GameObject {

    constructor(shape, value) {

        let scale = 1;

        let polygonObjectList;

        switch (shape) {
            case "Octagon":
                polygonObjectList = Objects.octagon(Victor(Math.abs(Math.random() * 700), Math.abs(Math.random() * 600)), scale);
                break;
            case "Diamond":
                polygonObjectList = Objects.diamond(Victor(Math.abs(Math.random() * 700), Math.abs(Math.random() * 600)), scale);
                break;
            case "Triangle":
                polygonObjectList = Objects.triangle(Victor(Math.abs(Math.random() * 700), Math.abs(Math.random() * 600)), scale);
                break;
        }

        let centerPoint = VectorMath.calculateCenter(polygonObjectList);
        let objectColor = ["#ff000f"];
        super([polygonObjectList], centerPoint, objectColor);

        this.upgradeValue = value;
        this.creationTime = new Date().getTime();
    }


};

module.exports = {BulletObject,PlayerObject,RocketObject,UpgradeObject};