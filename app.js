const express = require('express')
const { createServer } = require('http')
const Server = require('socket.io')
const session = require('express-session')
const db = require('./db/db')

const app = express()
const httpServer = createServer(app)

const sessionMiddleware = session({
  secret: 'changeit',
  resave: true,
  saveUninitialized: true
})

app.use('/public', express.static('public'))

app.use(sessionMiddleware)

app.post('/login', (req, res) => {
  req.session.authenticated = true
  res.status(204).end()
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/a', (req, res) => {
  res.sendFile(__dirname + '/test.html')
})

const io = new Server(httpServer)

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) =>
  middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

// only allow authenticated users
io.use((socket, next) => {
  let data = socket.handshake.query

  if (!data.customer_id || !data.customer_name) {
    return false
  } else {
    next()
  }
})

let users = {}

io.on('connection', async socket => {
  let data = socket.handshake.query

  if (!users[data.customer_id] && data.customer_id) {
    users[data.customer_id] = {
      client_id: socket.id,
      customer_id: data.customer_id,
      customer_name: data.customer_name
    }

    //socket.id = data.customer_id; // Setting client id
    console.log(`${data.customer_id} bağlandı`)
  }

  socket.on('msg_to_admin', async(msg, hrs, minutes) => {
    const msgData = {
      customer_id: data.customer_id,
      username: data.customer_name,
      msg: msg,
      hrs: hrs,
      minutes: minutes
    }

    await db.createMessage(data.customer_id, data.customer_name, msg)
    socket.to(users['999999'].client_id).emit('to_admin', msgData)
    socket.broadcast.emit('set_users', users)
  })

  socket.on('getMessages', async(id) => {
    id = parseInt(id);
    const messages = await db.getMessages(id);

    socket.emit('setMessages', messages)
  })

  socket.on('get_users', () => {
    socket.broadcast.emit('set_users', users)
  })

  socket.on('to_customer', async(req) => {
    await db.createMessage(req.customer_id, 'ADMIN', req.msg)
    socket.to(users[req.customer_id].client_id).emit('customer_msg', req)
  })

  socket.on('disconnect', () => {
    console.log(`${data.customer_id} çıkış yaptı`)
    removeUser(data.customer_id)
  })

  socket.broadcast.emit('set_users', users)
})

/////////////////////

const activeUsers = () => {
  console.log(`Aktif Kullanıcı Sayısı: ${Object.keys(users).length}`)
  setTimeout(() => {
    activeUsers()
  }, 3000)
}

;(() => {
  activeUsers()
})()

const removeUser = async customer_id => {
  delete users[customer_id]
}

httpServer.listen(3000, () => console.log('listening on *:3000'))
