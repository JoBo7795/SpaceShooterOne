const chatServer = function() {

    const io = require('socket.io').listen(3001, () => {
        console.log("listening on port: " + 3001)
    });

    let chatString = "";
    let userSocketList = [];

    io.on('connect', (socket) => {
        console.log("user connected with id: " + socket.id);
        userSocketList.push(socket.id);
    });

    io.on('connection', function (socket) {

        socket.on("chatMessage", (msg) => {
            chatString = '\n' + msg;
            for (let i = 0; i < userSocketList.length; i++) {

                if (userSocketList[i] === socket.id) {
                    io.to(`${userSocketList[i]}`).emit("chatObject", {
                        message: chatString,
                        color: "#ff6330",
                        align: "right"
                    });
                } else {
                    io.to(`${userSocketList[i]}`).emit("chatObject", {
                        message: chatString,
                        color: "#89ff43",
                        align: "left"
                    });
                }
                console.log(userSocketList[i])
            }
        });

        socket.on("disconnect", function () {
            console.log(`user with id: ${socket.id}  disconnected`)
        });
    });
}();


