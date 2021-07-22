const express = require('express');
const expressSession = require('express-session')

const app = new express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);  //socket.io 서버 생성

const ejs = require('ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.use('/views/img/map.png', express.static(__dirname+ '/views/img/map.png'));
app.use('/views/object/userObject.js', express.static(__dirname+ '/views/object/userObject.js'));
app.use('/views/object/rooms.js', express.static(__dirname+ '/views/object/rooms.js'));
app.use('/views/socket/render.js', express.static(__dirname+ '/views/socket/render.js'));
app.use('/views/socket/socket.js', express.static(__dirname+ '/views/socket/socket.js'));
app.use('/views/object/roomObject.js', express.static(__dirname+ '/views/object/roomObject.js'));
app.use('/public/css/room.css', express.static(__dirname+ '/public/css/room.css'));

const mongoose = require('mongoose');
const dbAddress = "mongodb+srv://whghtjd320:jhs2430570@cluster0.ylrcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const bcrypt = require('bcrypt')
const User = require('./models/User')

const mainController = require('./controllers/main')

const logoutController = require('./controllers/logout')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const storeUserController = require('./controllers/storeUser')
const newUserController = require('./controllers/newUser')

const redirectIfNotAuthMiddleware = require('./middleware/redirectIfNotAuthMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const validateMiddleWare = require('./middleware/validationMiddleware')
const authMiddleware = require('./middleware/authMiddleware')

app.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret:'keyboard cat'
}))

server.listen(process.env.PORT || 8000, () => {
    console.log("서버가 대기중입니다.");
})

app.use("*", (req, res, next)=>{
  loggedIn = req.session.userId;
  next()
})

var user_name = "";

// 로그인, 회원가입
app.get('/auth/logout', redirectIfNotAuthMiddleware, logoutController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.post("/users/login", (req, res) => {
  const {name, password} = req.body
  console.log(req.body)
  user_name = req.body.name;
  User.findOne({name:name}, (error, user) =>{
      if(user){
          bcrypt.compare(password, user.password, (error, same)=>{
              if(same){
                  req.session.userId = user._id
                  req.session.userName = user.name
                  if(!req.session.returnTo) res.redirect('/')
                  else res.redirect(req.session.returnTo)
              }
              else{
                  res.redirect('/auth/login')
              }
          })
      }
      else{
          res.redirect('/auth/login')
      }
  })
});

//main pages
app.get('/', mainController)

app.get('/campus', (req, res) => {
    res.sendFile(__dirname + '/views/client.html');
});

app.get('/campus/room/:id', (req, res) => {
    res.sendFile(__dirname + '/views/room.html');
    id = req.params.id;
    console.log(id);
});

app.all('*', (req, res)=>{
  res.render('404Page')
})

//색 랜덤
function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const canvasWidth = 1024;
const canvasHeight = 768;

const startX = canvasWidth/2;
const startY = canvasHeight/2;
let roomId = 0;
let ballId = 0;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = startX;
        this.y = startY;
        this.name = user_name;
        this.color = getPlayerColor();
    }

    get id() {
        return this.socket.id;
    }
}

var balls = [];
var ballMap = {};

function joinGame(socket){
    let ball = new PlayerBall(socket);

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
}

function endGame(socket){
    for( var i = 0 ; i < balls.length; i++){
        if(balls[i].id == socket.id){
            balls.splice(i,1); //시작점,지울개수
            break
        }
    }
    delete ballMap[socket.id];
}

var users = {};
var onlineUsers = {};


//on : 이벤트 받기(이벤트명,함수)
//emit : 이벤트 보내기(이벤트명,메시지)
io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        socket.broadcast.emit('leave_user', socket.id);
    });

    let newBall = joinGame(socket);
    socket.emit('user_id', {
        socketId: socket.id,
        userName: user_name
    });

    for (var i = 0 ; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user', {
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
        });
    }
    socket.broadcast.emit('join_user',{
        id: socket.id,
        x: newBall.x,
        y: newBall.y,
        color: newBall.color,
    });

    socket.on('send_location', function(data) {
            socket.broadcast.emit('update_state', {
                id: data.id,
                x: data.x,
                y: data.y,
            })
    });
  
    socket.on('enterRoom', function(data){
        roomId = data.roomId;
        userName = data.userName;
        console.log(userName + '님이 ' + roomId + '로 입장하였습니다.');

    });

    socket.on('get_info', function(data) {
        socket.emit('room_information', {
            roomId: roomId,
            socketId: socket.id,
            userName: userName
        })
    });

    socket.on('join', function(data) {
        socket.join(data);
    })

    socket.on("send message", function (data) {
        console.log(data.msg);
        io.sockets.in(data.roomId).emit('new message', {
            socketId: data.socketId,
            userName: data.userName,
            msg: data.msg
        });
    });

})
