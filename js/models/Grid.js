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

    initGrid() {
        this._cells = [];
        for (let row = 0; row < this._height; row++) {
            this._cells[row] = [];         
            for (let col = 0; col < this._width; col++) {
                this._cells[row][col] = new Cell(row, col);
            }
        }
    }

}