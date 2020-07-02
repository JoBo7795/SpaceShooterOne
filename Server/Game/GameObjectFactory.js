const {BulletObject, PlayerObject, RocketObject, UpgradeObject} = require("../../Resources/DrawResources/ServerSideObjects.js");

module.exports = class GameObjectFactory {

    constructor(){}

    createPlayerObject(socketID) {
        return new PlayerObject(socketID);
    }

    createShot(spawnCoordinates,rotation,movementVector){
        return new BulletObject(spawnCoordinates,rotation,movementVector)
    }

    createRocket(spawnCoordinates,rotation,movementVector){
        return new RocketObject(spawnCoordinates,rotation,movementVector)
    }

    createShotUpgrade(){
        return new UpgradeObject("Octagon",1)
    }

    createTripleShotUpgrade(){
        return new UpgradeObject("Diamond",2)
    }

    createRocketUpgrade(){
        return new UpgradeObject("Triangle",3)
    }
};