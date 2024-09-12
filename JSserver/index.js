const app = require('express')();
const http = require('http').Server(app);

const { instrument } = require('@socket.io/admin-ui')
const io = require('socket.io')(http, {
    cors: {
        origin: ['https://admin.socket.io', 'http://localhost:3000'],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const players = {
    //* Schema
    // room1: {
    //     id1: { id: "", username: "", character: "", x: 0, y: 0 },
    //     id2: { id: "", username: "", character: "", x: 0, y: 0 },
    // },
    // room2: {
    //     id1: { id: "", username: "", character: "", x: 0, y: 0 },
    //     id2: { id: "", username: "", character: "", x: 0, y: 0 },
    // },
}

io.on('connection', (socket) => {
    console.log(`player ${socket.id} connected`);

    socket.on('join-room', (room, cb) => {
        socket.join(room)
        console.log(`player ${socket.id} joined room ${room}`);
        cb({ id: socket.id, room: room })
        if (!players[room]){
            players[room] = {}
        }
        players[room][socket.id] = {
            id: socket.id,
            username: "",
        }
        io.to(room).emit('update-room', players[room])
    })

    socket.on('start-game', (room) =>{

        // Algorithm to decide who is the seeker
        const listOfPlayers = Object.keys(players[room])    //["id1", "id2"]
        const seekerIdx = Math.floor(Math.random() * listOfPlayers.length)
        const seekerID = listOfPlayers[seekerIdx]

        //Algorithm to decide each players' spawn location
        const coords = [
            {x: 300, y:300 },
            {x: 400, y:400 },
            {x: 500, y:500 },
        ]
        listOfPlayers.forEach((id, idx) => {
            if (id === seekerID){
                players[room][id] = { ...players[room][id], character: "seeker", x: coords[idx].x, y: coords[idx].y }

            } else {
                players[room][id] = { ...players[room][id], character: "hider", x: coords[idx].x, y: coords[idx].y }
            }
        })
        io.to(room).emit('update-room', players[room])

        io.to(room).emit('teleport-players')

    })

    socket.on("in-game", (room) => {
        io.to(room).emit('update-client', players[room])
    })

    // socket.on("update-server", players_Client => {
    //     Object.keys(players_Client).forEach(id => {
    //         players["123"][id] = players_Client[id]
    //     })
    //     socket.emit('update-client', players["123"])
    // })

    socket.on("moved", (coords, room) => {
        players[room][socket.id].x = coords.x
        players[room][socket.id].y = coords.y
        io.to(room).emit('update-client', players[room])
    })

    //todo 
    socket.on("killed", (room) => {
        players[room][socket.id].isAlive = false
        io.to(room).emit('update-client', players[room])
    })

    // socket.on('join-room', (room, coords, cb) => {
    //     socket.join(room)

    //     const playersID = Array.from(io.of("/").adapter.rooms.get(room));

    //     cb({ id: socket.id, room: room })

    //     io.to(room).emit('update-room', playersID, socket.id, coords)
    // })

    // socket.on('moving', (room, coords) => {
    //     const playersID = Array.from(io.of("/").adapter.rooms.get(room));
    //     io.to(room).emit('update-room', playersID, socket.id, coords)
    // })

    // socket.on('disconnecting', () => {
    //     Array.from(socket.rooms).forEach(
    //         room => {
    //             let playersID = Array.from(io.of("/").adapter.rooms.get(room)).filter(p => p !== socket.id)
    //             io.to(room).emit('update-room', playersID, socket.id, null)
    //         }
    //     )
    // })


    socket.on('disconnecting', () => {
        Array.from(socket.rooms).forEach(
            room => {
                if (room !== socket.id){
                    delete players[room][socket.id]
                    io.to(room).emit('update-room', players[room])
                    console.log(`player ${socket.id} left room ${room}`);
                }
            }
        )
    })

    socket.on('disconnect', () => {
        console.log(`player ${socket.id} disconnected`);
    });
});

http.listen(3030, () => {
    console.log('server listening on localhost:3030');
});


instrument(io, {
    auth: false
});
