const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
require("dotenv").config();
const { ExpressPeerServer } = require('peer');
var cors = require('cors')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors({
  origin:"*"
}))
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log("userid", userId, "rom", roomId)
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.port, () => {
  console.log(`${process.env.port},port`);
})
// const peerserv = app.listen(9000);
// const peerServer = ExpressPeerServer(peerserv, {
//   path: '/'
// });
// app.use('/', peerServer);