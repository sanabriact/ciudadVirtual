class Map{
    constructor(width, height, cells){
        this._width=width || null;
        this.height=height || null;
        this._cells=cells || [];
    }
    //==========GETTERS=============
    get width(){
        return this._width;
    }
    get height(){
        return this._height;
    }
    get cells(){
        return this._cells;
    }
    //==========SETTERS=============
    set width(width){
        if(width >=0){
            this._width=width;
        }
    }
    set height(height){
        if(height >=0){
            this._height=height;
        }
    }
    set cells(cells){
        if(cells instanceof Array){
            this._cells=cells;
        }
    }
    isEmpty(x,y){
        if(x==null || y==null){
            return false;
        }
    }

}