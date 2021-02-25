function CameraGrid(cols, rows, cellWidth, cellHeight)
{
    this.cols = cols;
    this.rows = rows;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.halfCellWidth = cellWidth / 2;
    this.halfCellHeight = cellHeight / 2;

    this.grid = [];

    var round = Math.round;
    var min = Math.min;
    var max = Math.max;

    /**
     * Resets the CameraGrid by clearing all the cells
     */
    this.reset = function()
    {
        this.grid.length = 0;
    
        var cols = this.cols;
        var rows = this.rows;
        var i, j;
    
        for(i = 0; i < cols; i++)
        {
            this.grid.push([]);
            // Create a cell with no __proto__ object
            for(j = 0; j < rows; j++)
            {
                this.grid[i][j] = Object.create(null);
            }
        }
        
        this.minCol = 0;
        this.minRow = 0;
        this.maxCol = this.grid.length - 1;
        this.maxRow = this.grid[0].length - 1;
    };

    /**
     * Converts x and y to col and row
     * 
     * @method CameraGrid#getCoordinates
     * @returns {object} col and row
     */
    this.getCoordinates = function(x, y)
    {
        return {
            col: max(min(round((x - this.halfCellWidth) / this.cellWidth), this.maxCol), this.minCol),
            row: max(min(round((y - this.halfCellHeight) / this.cellHeight), this.maxRow), this.minRow)
        };
    };

    this.addReference = function(object)
    {   
        var key = object._arrayName + object._id;
        var toSet = {
            arrayName: object._arrayName,
            id: object._id
        };

        var box = object.bodyConf.boundingBox;

        var minCol = max(min(round((box.minX - this.halfCellWidth) / this.cellWidth), this.maxCol), this.minCol),
            minRow = max(min(round((box.minY - this.halfCellHeight) / this.cellHeight), this.maxRow), this.minRow),
            maxCol = max(min(round((box.maxX - this.halfCellWidth) / this.cellWidth), this.maxCol), this.minCol),
            maxRow = max(min(round((box.maxY - this.halfCellHeight) / this.cellHeight), this.maxRow), this.minRow);

        var col, row;

        for(col = minCol; col <= maxCol; col++)
        {
            for(row = minRow; row <= maxRow; row++)
            {
                this.grid[col][row][key] = toSet;
            }
        }

        object._minCol = minCol;
        object._minRow = minRow;
        object._maxCol = maxCol;
        object._maxRow = maxRow;
    };

    this.removeReference = function(object)
    {
        var key = object._arrayName + object._id;

        var minCol = object._minCol,
            minRow = object._minRow,
            maxCol = object._maxCol,
            maxRow = object._maxRow;

        var col, row;

        for(col = minCol; col <= maxCol; col++)
        {
            for(row = minRow; row <= maxRow; row++)
            {
                delete this.grid[col][row][key];
            }
        }
    };

    this.loopThroughCells = function(minCol, minRow, maxCol, maxRow, callback)
    {
        var col, row;

        for(col = minCol; col <= maxCol; col++)
        {
            for(row = minRow; row <= maxRow; row++)
            {
                callback(this.grid[col][row], col, row);
            }
        }
    };

    // Will be expensive since this applies to the entire grid
    this.removeAll = function(arrayToRemove)
    {
        var col, row, cell, i;

        for(col = this.minCol; col <= this.maxCol; col++)
        {
            for(row = this.minRow; row <= this.maxRow; row++)
            {
                cell = this.grid[col][row];

                for(i in cell)
                {
                    if(cell[i].arrayName === arrayToRemove)
                    {
                        delete cell[i];
                    }
                }
            }
        }
    };
}

module.exports = CameraGrid;