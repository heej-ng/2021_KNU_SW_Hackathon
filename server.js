const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);  //socket.io 서버 생성

server.listen(process.env.PORT || 8000, () => {
    console.log("서버가 대기중입니다.");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/room', (req, res) => {
    res.sendFile(__dirname + '/views/room.html');
    id = req.params.id;
    console.log(id);
});

app.use('/views/img/map.png', express.static(__dirname+ '/views/img/map.png'));
app.use('/views/userObject.js', express.static(__dirname+ '/views/userObject.js'));
app.use('/views/rooms.js', express.static(__dirname+ '/views/rooms.js'));
app.use('/views/roomObject.js', express.static(__dirname+ '/views/roomObject.js'));

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
    socket.emit('user_id', socket.id);

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
        ballId = data.ballId;
        console.log(ballId + '님이 ' + roomId + '로 입장하였습니다.');
    })

})