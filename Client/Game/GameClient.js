import MultiplayerGame from "./MultiplayerGame.js";

let connection = io();

$(function () {

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    const multiplayerGame = new MultiplayerGame(document.getElementById("myCanvas"), '2d');

    let rightPressed = false;
    let leftPressed = false;
    let upPressed = false;
    let downPressed = false;

    connection.on("package", msg => {

        msg.forEach(e => {
            switch (e.key) {
                case "windowSize":
                    multiplayerGame.canvas.width = e.value.width;
                    multiplayerGame.canvas.height = e.value.height;
                    break;

                case "drawObject":
                    multiplayerGame._clientObjectArray = e.value;
                    multiplayerGame.DrawObjectArray = e.value;
                    break;

                case "hit":
                    multiplayerGame._hitScreen = e.value;
                    console.log("hit");
                    break;

                case "particleCoords":
                    multiplayerGame._particleProperties = e.value;
                    multiplayerGame._particles = true;
                    break;

                case "upgradeObject":
                    multiplayerGame.upgradeObjectArray = e.value;
                    break;
            }
        });
    });


    function keyDownHandler(e) {

        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        } else if (e.key === "ArrowUp" || e.key === "ArrowUp") {
            upPressed = true;
        } else if (e.key === "ArrowDown" || e.key === "ArrowDown") {
            downPressed = true;
        } else if (e.code === "Space") {
            connection.emit("shoot");
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        } else if (e.key === "ArrowUp" || e.key === "ArrowUp") {
            upPressed = false;
        } else if (e.key === "ArrowDown" || e.key === "ArrowDown") {
            downPressed = false;
        }
    }

    function sendControlFunc() {
        if (rightPressed)
            connection.emit("right");
        if (leftPressed)
            connection.emit("left");
        if (upPressed)
            connection.emit("up");
        if (downPressed)
            connection.emit("down");
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    setInterval(sendControlFunc, 10);
    setInterval(multiplayerGame.draw.bind(multiplayerGame), 4);

});

let sendShip = (val) => {
    connection.emit(val)
};

function obstaclePromise() {
    return new Promise((res, rej) => {
        connection.on("Obstacle1", (msg) => {
            res(msg);       //TODO soll über NotificationQueue Wert erhalten
        });
    });
}

let getObstacle = async (val) => {
    connection.emit(val);
    return await obstaclePromise();
};

export {sendShip, getObstacle};