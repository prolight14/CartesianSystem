var createAA = require("./CreateAA.js");

function GameObjectHandler()
{
    var gameObjects = createAA([], undefined, "gameObjects");

    // Process list used for loop (mainly so we don't use an object again)
    var usedFL = {};
    // Will be used as a cache to contain all the stuff we need to process
    var used = {};

    this.forEach = function(callback)
    {
        return gameObjects.forEach(callback);
    };

    this.addArray = function(name, gameObjectArray)
    {
        return gameObjects.addObject(name, gameObjectArray);
    };
    
    this.getArray = function(name)
    {
        return gameObjects.getObject(name);
    };

    this.removeArray = function(name)
    {
        return gameObjects.removeObject(name);
    };

    this.resetProcessList = function()
    {
        usedFL = {};
        used = {};
    };

    this.addToProcessList = function(cameraGrid, minCol, minRow, maxCol, maxRow) 
    {
        var grid = cameraGrid.grid;

        var col, row, cell, i, object, id;

        // Loop through grid
        for(col = minCol; col <= maxCol; col++)
        {
            for(row = minRow; row <= maxRow; row++)
            {
                cell = grid[col][row];

                // Loop through the cell
                for(i in cell)
                {
                    // We already recorded key (`object._arrayName + object._id`), so don't do it again since some 
                    // objects can be in multiple cells at a time
                    if(usedFL[i])
                    {
                        continue;
                    }

                    // Is the same as createAA#getObject(name)
                    object = gameObjects[gameObjects.references[cell[i].arrayName]][cell[i].id];

                    // Save info for rendering
                    id = gameObjects.references[object._arrayName];
                    used[id] = used[id] === undefined ? [] : used[id];
                    used[id].push(object._id);

                    // Show we've recorded the key (`object._arrayName + object._id`)
                    usedFL[i] = true;
                }
            }
        }

        // Sort the used id array
        for(id in used)
        {
            used[id].sort();
        }
    };

    /**
     * 
     * @param {object} cameraGrid The cameragrid to pass in
     * @param {string} key The name of the method to execute on every game object that's in the process list (must be in every game object)
     */
    this.act = function(cameraGrid, key)
    {
        var id, j, object;

        for(id in used)
        {
            for(j = 0; j < used[id].length; j++)
            {
                object = gameObjects[id][used[id][j]];

                object[key]();

                // Refreshes the object's cell place after it has been moved 
                if(object.bodyConf.moves)
                {
                    cameraGrid.removeReference(object);
                    cameraGrid.addReference(object);
                }
            }
        }
    };

    this.loopProcessList = function(cameraGrid, callback)
    {
        var i, j, object;

        for(i in used)
        {
            for(j = 0; j < used[i].length; j++)
            {
                object = gameObjects[i][used[i][j]];

                callback(object, gameObjects.references[i], used[i][j]);

                // Refreshes the object's cell place after it has been moved 
                if(object.bodyConf.moves)
                {
                    cameraGrid.removeReference(object);
                    cameraGrid.addReference(object);
                }
            }
        }
    };
}

module.exports = GameObjectHandler;