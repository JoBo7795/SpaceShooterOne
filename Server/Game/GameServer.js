"use strict";

const express = require("express");
const {Server} = require("http");
const path = require("path");
const VectorMath = require("../../Math/VectorMath.js");
const CollisionDetection = require("../../Math/CollsionDetection.js");
const GameFunctions = require("./GameFunctions.js");
const GameObjectFactoryObject =require("./GameObjectFactory.js");
const notificationQueueObject = require("../Network/NotificationQueue.js");
const socket = require('socket.io');

let server;
server = function () {

    let drawObjectString = "drawObject";
    const app = express();
    const http = Server(app);
    const io = socket(http);
    const GameObjectFactory = new GameObjectFactoryObject();
    const notificationQueue = new notificationQueueObject(io);

    const clientObjectArray = [];
    const shootObjectArray = [];
    const particleObjectArray = [];
    const upgradeObjectArray = [];
    let drawableObjectArray = [];
    let upgradeResolveStatus = true;

    const windowWidth = 1000;
    const windowHeight = 800;

    app.use(express.static(path.resolve(__dirname + '..\\..\\..\\Client')));
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '..\\..\\..\\Client\\index.html'));

    });

    io.on('connect', function (socket) {
        console.log('an user connected, socket ID: ' + socket.id);

        clientObjectArray.push(GameObjectFactory.createPlayerObject(socket.id));

        notificationQueue.addClient(socket.id);
        notificationQueue.addQueueEntry(socket.id, "windowSize", {width: windowWidth, height: windowHeight});

        drawableObjectArray.push(...clientObjectArray)
    });

    io.on('connection', function (socket) {

        socket.on('right', function () {
            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {

                    clientObjectArray[i].rotateRight();
                    clientObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));

                }
            }
        });

        socket.on('left', function () {

            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {

                    clientObjectArray[i].rotateLeft();
                    clientObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));
                }
            }
        });

        socket.on('up', function () {

            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {


                    clientObjectArray[i].moveUp(windowHeight,windowWidth);
                    clientObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));
                }
            }
        });

        socket.on('down', function () {

            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {

                    clientObjectArray[i].moveDown(windowHeight,windowWidth);
                    clientObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));
                }
            }
        });

        socket.on('shoot', function () {

            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {

                    switch (clientObjectArray[i].upgrades) {
                        case 1:
                            shootObjectArray.push(GameFunctions.singleShot(clientObjectArray[i])); // push one Shot into shootObjectArray
                            break;
                        case 2:
                            GameFunctions.tripleShot(clientObjectArray[i]).forEach(e => shootObjectArray.push(e));// pushes three Shots into shootObjectArray
                            break;
                        case 3:
                            shootObjectArray.push(GameFunctions.rocketShot(clientObjectArray[i]));
                            break;

                    }

                    shootObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));

                }
            }
        });

        socket.on("disconnect", function () {
            for (let i = 0; i < clientObjectArray.length; i++) {
                if (clientObjectArray[i].socketID === socket.id) {
                    clientObjectArray.splice(i, 1)
                }
            }
            console.log("disconnected player with id: " + socket.id);
        });

    });

    function update() {

        for (let i = 0; i < shootObjectArray.length; i++) {

            for (let l = 0; l < shootObjectArray[i].polygonObjectList.length; l++) {
                shootObjectArray[i].polygonObjectList[l] = VectorMath.transformPolygon(shootObjectArray[i].polygonObjectList[l], VectorMath.negotiateVector(shootObjectArray[i].shootRot));

            }
            shootObjectArray[i].centerPoint = VectorMath.transformVector(shootObjectArray[i].centerPoint, VectorMath.negotiateVector(shootObjectArray[i].shootRot))
        }

        collisionDetection();

        if (upgradeResolveStatus) {
            createUpgrade();
            upgradeResolveStatus = false;
        }

        clientObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));
        shootObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));
        upgradeObjectArray.forEach(e=>drawableObjectArray.push({polygonObjectList:e.polygonObjectList,centerPoint:e.centerPoint,objectColor:e.objectColor}));

        notificationQueue.addQueueEntry(0, "particles", particleObjectArray);
        notificationQueue.addQueueEntry(0, "drawObject", drawableObjectArray);

        drawableObjectArray = [];

    }

    http.listen(3000, function () {
        console.log('listening on *:3000');
    });

    setInterval(update, 4);
    setInterval(notificationQueue.distributeQueue.bind(notificationQueue), 1);


    function createUpgrade() {
        return new Promise(() => {

            upgradeObjectArray.push(GameFunctions.upgrade());
            setTimeout(() => {
                upgradeResolveStatus = true
            }, 10000)
        })
    }

    function manageUpgradeObjectTime() {

        const time = new Date().getTime();

        for (let i = 0; i < upgradeObjectArray.length; i++) {

            if (time - upgradeObjectArray[i].creationTime > 5000) {
                upgradeObjectArray.splice(i, 1);
            }
        }
    }

    setInterval(manageUpgradeObjectTime, 500);

    function collisionDetection() {

        for (let k = 0; k < clientObjectArray.length; k++) {    // Objekt finden
            for (let j = 0; j < clientObjectArray[k].polygonObjectList.length; j++) {
                for (let l = 0; l < upgradeObjectArray.length; l++) {
                    if (CollisionDetection.nAxisseperateCollisionDetection(clientObjectArray[k].polygonObjectList[j], upgradeObjectArray[l].polygonObjectList[0])) {
                        clientObjectArray[k].upgrades = upgradeObjectArray[l].upgradeValue;
                        upgradeObjectArray.splice(l, 1);
                    }
                }

                for (let i = 0; i < shootObjectArray.length; i++) { // Schuss finden
                    if (CollisionDetection.nAxisseperateCollisionDetection(clientObjectArray[k].polygonObjectList[j], shootObjectArray[i].polygonObjectList[0])) {

                        notificationQueue.addQueueEntry(0, "particleCoords", {coords:shootObjectArray[i].centerPoint, rotation:shootObjectArray[i].shootRot});

                        // Schuss nach Kollision aus Array entfernen
                        shootObjectArray.splice(i, 1);

                        //bei getroffenem Spieler Objekt Lebenspunkt(e) abziehen
                        clientObjectArray[k].lifeCount--;

                        // nur auf dem getroffenen Client wird der rote Bildschirm ausgelößt
                        notificationQueue.addQueueEntry(clientObjectArray[k].socketID, "hit", 5);

                        // falls die Lebenspunkte Anzahl unter 0 fällt, wird der Client aus dem Array, also aus dem Spiel entfernt
                        if (clientObjectArray[k].lifeCount <= 0) {
                            clientObjectArray.splice(k, 1);

                            // entfernen des zerstörten Schiffes auf allen Clients
                            drawableObjectArray.push(clientObjectArray)
                        }
                        return;
                    }
                    // Spielfeldrand auf Kollsion mit Schuss prüfen
                    if (shootObjectArray[i].centerPoint.y < 0 || shootObjectArray[i].centerPoint.y > windowHeight || shootObjectArray[i].centerPoint.x < 0 || shootObjectArray[i].centerPoint.x > windowWidth) {
                        shootObjectArray.splice(i, 1);
                        return;
                    }

                }
            }

        }
    }
}();