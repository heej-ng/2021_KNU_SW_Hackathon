class PlayerBall{
    constructor(id,x,y,name,department,phone,comment){
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = 1;
        this.playerSpeed = 4;
        this.name = name;
        this.department=department;
        this.phone=phone;
        this.comment=comment;
    }
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getname(){
        return this.name;
    }
    setname(name){
        this.name = name;
    }
    getdepartment(){
        return this.department;
    }
    setdepartment(department){
        this.department = department;
    }
    getphone(){
        return this.phone;
    }
    setphone(콜){
        this.phone = phone;
    }
    getcomment(){
        return this.comment;
    }
    setcomment(comment){
        this.comment = comment;
    }
    getX(){
        return this.x;
    }
    setX(x){
        this.x = x;
    }
    getY(){
        return this.y;
    }
    setY(y){
        this.y = y;
    }
    getColor(){
        return this.color;
    }
    setColor(color){
        this.color = color;
    }

    getPlayerSpeed(){
        return this.playerSpeed;
    }
    setPlayerSpeed(playerSpeed){
        this.playerSpeed = playerSpeed;
    }
}
