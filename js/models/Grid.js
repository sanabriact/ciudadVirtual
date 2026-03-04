class Grid {
    constructor(width, height, cells) {
        this._width = width ?? 15;
        this._height = height ?? 15;
        this._cells = cells || [];
    }

    //==========SETTERS=============
    set _width(width) {
        if (width >= 15) {
            this._width = width;
        }
    }
    set _height(height) {
        if (height >= 15) {
            this._height = height;
        }
    }
    set _cells(cells) {
        if (cells instanceof Array) {
            this._cells = cells;
        }
    }

}