import {inputfield,textfield} from "../UserInterface/userInterface.js"


const chatClient = function () {

    let clientConnection;

    $(function () {

        clientConnection = io("http://localhost:3001", {'force new connection': true});

        clientConnection.on("chatObject", (msg) => {
            textfield.innerHTML += `<div style="color:${msg.color}; text-align:${msg.align}">${msg.message}</div>`;
            inputfield.value = "";
        });

    });

    chatbutton.onclick = () => {
        clientConnection.emit("chatMessage", inputfield.value);
        inputfield.value = "";
    };

    function keyDownHandler(e) {

        if (e.key === "Enter" || e.key === "Enter") {
            clientConnection.emit("chatMessage", inputfield.value);

        }

    }

    document.addEventListener("keydown", keyDownHandler, false);

}();
