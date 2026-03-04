class Grid {
    constructor(width, height, cells) {
        this._width = width ?? 15;
        this._height = height ?? 15;
        this._cells = cells || [];
    }
    //==========GETTERS=============
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get cells() {
        return this._cells;
    }
    //==========SETTERS=============
    set width(width) {
        if (width >= 15) {
            this._width = width;
        }
    }
    set height(height) {
        if (height >= 15) {
            this._height = height;
        }
    }
    set cells(cells) {
        if (cells instanceof Array) {
            this._cells = cells;
        }
    }

}