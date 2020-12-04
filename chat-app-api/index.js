const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let users = [];

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

io.on('connection', function (socket) {
    var isAdded = false;
    
    socket.on('JOIN_USER', function (username) {
        if (!isAdded) {
            users.push({ id: socket.id, name: username }); 
            isAdded = true;
        }
    });

    socket.on('GET_SOCKET',function(){
        const id = socket.id;
        const user = users.find(user => user.id === id);
        io.to(id).emit('GET_SOCKET',id);
        if(user){
            io.emit('GROUP_CHAT_MESSAGE', { id:id, from: user.name, msg: 'Joined chat' });
        }
        io.emit('REFRESH_USER', users);
    });

    socket.on('GROUP_CHAT_MESSAGE', function (data) {
        const id = socket.id;
        const user = users.find(user => user.id === id);
        if(user){
            io.emit('GROUP_CHAT_MESSAGE', { id:id, from: user.name, msg: data.msg });
        }
    });

    socket.on('SEND_MESSAGE_USER', function (data) {
        io.to(data.id).emit("SEND_MESSAGE_USER", data);
    });

    socket.on('disconnect', function () {
        const currentUser = users.find(user => user.id == socket.id);
        users = users.filter(user => user.id !== socket.id);
        if(currentUser){
            io.emit('GROUP_CHAT_MESSAGE', { id:currentUser.id, from: currentUser.name, msg: 'Left chat' });
        }
        io.emit('REFRESH_USER', users);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});