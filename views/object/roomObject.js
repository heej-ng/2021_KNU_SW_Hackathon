class Room {
    constructor(id, x, y, width, height){
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
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
    getWidth() {
        return this.width;
    }
    setWidth(width) {
        this.width = width;
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
    }
}
