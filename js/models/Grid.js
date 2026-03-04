class Grid {
    constructor(width, height, cells) {
        this._width = width ?? 15;
        this._height = height ?? 15;
        this._cells = cells || [];
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