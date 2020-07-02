import {sendShip,getObstacle} from "../Game/GameClient.js";

const inputfield = document.getElementById("input");
const innerchat = document.getElementById("innerchat");
const chat = document.getElementById("chat");
const textfield = document.createElement('div');
const chatbutton = document.createElement("button");
const radiofieldset = document.createElement("fieldset");

const radioList = [];

chatbutton.id = "chatbutton";
chatbutton.textContent = "Send";

textfield.id = "textarea";

innerchat.style.width = "260px";

chat.insertBefore(textfield, innerchat);
innerchat.appendChild(chatbutton);
innerchat.appendChild(radiofieldset);

radiofieldset.id = "shipSelectionFieldSet";


for (let i = 0; i < 3; i++) {

    const radio = document.createElement("input");
    const text = document.createElement("div");

    switch (i) {
        case 0:
            text.textContent = `Rechteck: `;
            radio.value = "rectangle";
            break;
        case 1:
            text.textContent = `Octagon: `;
            radio.value = "octagon";
            break;
        case 2:
            text.textContent = `Etwas ganz anderes: `;
            radio.value = "ship";
            break;
        default:
            text.textContent = `Ship ${i + 1}: `;
            break;
    }

    text.id = `shipSelectDiv`;

    radio.type = "radio";
    radio.name = "shipSelect";
    radio.id = `shipSelect${i + 1}`;
    radio.textContent = `shipSelect${i + 1}`;
    radio.onclick = () => (sendShipFunc(radio.value));

    radioList.push({radio: radio, text: text});
    radioList[i].text.appendChild(radioList[i].radio);

    radiofieldset.appendChild(radioList[i].text);

}

function sendShipFunc(val) {
    sendShip(val);
}

for (let i = 1; i <= 3; i++) {

    let canvas = document.createElement("canvas");

    canvas.id = `Obstacle${i}`;
    console.log(canvas);
    canvas.className = "obstacleSelection";

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    getObstacleFunc("ObstacleCoords").then(obstacle => {
        ctx.moveTo(obstacle[`Obstacle${i}`].coords[0].x + 50, obstacle[`Obstacle${i}`].coords[0].y + 50);
        obstacle[`Obstacle${i}`].coords.forEach(e => {
            ctx.lineTo(e.x + 50, e.y + 50);

        });
        ctx.lineTo(obstacle[`Obstacle${i}`].coords[0].x + 50, obstacle[`Obstacle${i}`].coords[0].y + 50);
        ctx.fillStyle = obstacle[`Obstacle${i}`].color;
        ctx.fill();
        ctx.stroke();

    });
}

async function getObstacleFunc(val) {
    return await getObstacle(val).then(tmp=>{return tmp});

}

export {inputfield, innerchat, chat, chatbutton, textfield}