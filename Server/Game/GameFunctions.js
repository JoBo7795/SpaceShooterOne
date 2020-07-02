const GameObjectFactoryObject = require("./GameObjectFactory.js");
const GameObjectFactory = new GameObjectFactoryObject();

module.exports = class gameFunctions {

// takes a reference Object
// returns array of 3 Shots
    static tripleShot(clientObject) {
        return [
            GameObjectFactory.createShot(clientObject.middleShotPosition(), clientObject.objRotation,clientObject.rotVec),
            GameObjectFactory.createShot(clientObject.leftShotPosition(),  clientObject.objRotation,clientObject.rotVec),
            GameObjectFactory.createShot(clientObject.rightShotPosition(),  clientObject.objRotation,clientObject.rotVec)
        ]
    }

// returns a Shot Object
    static singleShot(clientObject) {
        return GameObjectFactory.createShot(clientObject.middleShotPosition(), clientObject.objRotation,clientObject.rotVec);

    }

    static rocketShot(clientObject){
        return GameObjectFactory.createRocket(clientObject.middleShotPosition(), clientObject.objRotation,clientObject.rotVec);
    }

    static upgrade() {

        let randNum = Math.round(Math.random() * 3);

        if (randNum < 1)
            randNum = 1;

        switch (randNum) {
            case 1:
             return GameObjectFactory.createShotUpgrade();

            case 2:
             return GameObjectFactory.createTripleShotUpgrade();

            case 3:
             return GameObjectFactory.createRocketUpgrade();

        }

    }
};
