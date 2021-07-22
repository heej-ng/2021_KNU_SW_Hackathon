var socket = io();

socket.on('user_id', function(data){
    myId = data.socketId,
    myName = data.userName;
});
socket.on('join_user', function(data){
    joinUser(data.id, data.color, data.x, data.y, data.name);
})
socket.on('leave_user', function(data){
    leaveUser(data);
})
socket.on('update_state', function(data){
    updateState(data.id, data.x, data.y);
}) 

function joinUser(id, color, x, y, name){
    let ball = new PlayerBall(id);
    ball.color = color;
    ball.x = x;
    ball.y = y;
    ball.name = name;

    balls.push(ball);
    ballMap[id] = ball;

    return ball;
}

function leaveUser(id){
    for(var i = 0 ; i < balls.length; i++){
        if(balls[i].id == id){
            balls.splice(i,1);
            break;
        }
    }
    delete ballMap[id];
}

function updateState(id,x,y){
    let ball = ballMap[id];
    if(!ball){
        return;
    }
    ball.x = x;
    ball.y = y;
}
