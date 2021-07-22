function roomDetection() {
    let ball = ballMap[myId];
    var roomId;
    for (var i=0; i<rooms.length; i++) {
        if ((ball.getX()+450 < rooms[i].getX() + rooms[i].getWidth()) && ball.getY() == rooms[i].getY()) {
            roomId = rooms[i].getId()                   
            alert(roomId + '호로 입장합니다.');
            socket.emit('enterRoom', {
                roomId: roomId, 
                userName: myName
            });
            location.href = "./room/" + roomId;//
            break;
        }
    }
}

function sendData() {
    let curPlayer = ballMap[myId];
    let data = {};
    data = {
        id : curPlayer.id,
        x: curPlayer.x,
        y: curPlayer.y,
    };
    if(data){
        socket.emit("send_location", data);
    }
}

function renderPlayer() {       
        for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.font = '15px Arial';
            ctx.fillText(`player ${i}`,ball.x-radius-7, ball.y-radius);
            ctx.closePath();
        }

        let curPlayer = ballMap[myId];
        
        if (rightPressed){
            curPlayer.x += playerSpeed;
        }
        if (leftPressed ){
            curPlayer.x -= playerSpeed;
        }
        if(upPressed ){
            curPlayer.y -= playerSpeed;
        }
        if(downPressed ){
            curPlayer.y += playerSpeed;
        }
        sendData();
}
var selectFloor;
let cnt = 0;
function evDetection() {
    let ball = ballMap[myId];
    if ((ball.getX()+440 > 1120) && ((ball.getY() + 80) > 553) && cnt<=0) {
        cnt++;
        selectFloor = prompt('몇 층으로 갈까요?');

        if (selectFloor === "1층") {
             window.location.href = '/campus/client_floor1';
            
         }
         else {
             location.href = "/campus";
         }
    }
}
