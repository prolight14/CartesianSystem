var CameraGrid = require("./CameraGrid.js");
var Camera = require("./Camera.js");
var GameObjectHandler = require("./GameObjectHandler.js");

var CartesianSystem = { 
    World: function(config)
    {
        this.camera = new Camera(
            config.window.x === undefined ? 0 : config.window.x,
            config.window.y === undefined ? 0 : config.window.y,
            config.window.width,
            config.window.height
        );

        this.grid = new CameraGrid(
            config.grid.cols, 
            config.grid.rows, 
            config.grid.cellWidth,
            config.grid.cellHeight
        );

        this.gameObjectHandler = new GameObjectHandler();

        this.init = function()
        {
            this.grid.reset();

            return this;
        };

        var _this = this;
        this.add = {};
        this.add.gameObjectArray = function()
        {
            if(arrayName === undefined) 
            { 
                arrayName = object.name.charAt(0).toLowerCase() + object.name.slice(1); 
            }

            var array = _this.gameObjectHandler.addArray(arrayName, createAA(object, undefined, arrayName));

            var lastAdd = array.add;
            Object.defineProperty(array, "add", 
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: function()
                {
                    var gameObject = lastAdd.apply(this, arguments);
                    _this.cameraGrid.addReference(gameObject);
                    return gameObject;
                }
            });
            var lastAddObject = array.addObject;
            Object.defineProperty(array, "addObject", 
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: function()
                {
                    var gameObject = lastAddObject.apply(this, arguments);
                    if(gameObject === undefined) 
                    { 
                        return;
                    }

                    _this.cameraGrid.addReference(gameObject);
                    return gameObject;
                }
            });

            var lastRemove = array.remove;
            Object.defineProperty(array, "remove",  
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: function(id)
                {
                    _this.cameraGrid.removeReference(this[id]);
                    return lastRemove.apply(this, arguments);
                }
            });
            var lastRemoveObject = array.removeObject;
            Object.defineProperty(array, "removeObject",  
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: function(name)
                {
                    _this.cameraGrid.removeReference(this[this.references[name]]);
                    return lastRemoveObject.apply(this, arguments);
                }
            });

            return array;
        };
        this.add.gameObject = function(arrayName)
        {
            var gameObjectArray = _this.gameObjectHandler.getArray(arrayName);
            var gameObject = gameObjectArray.add.apply(gameObjectArray, Array.prototype.slice.call(arguments, 1));
            cameraGrid.addReference(gameObject);
            return gameObject;
        };

        this.get = {};
        this.get.gameObjectArray = function(arrayName)
        {
            return _this.gameObjectHandler.getArray(arrayName);
        };
        this.get.gameObject = function(arrayName, id)
        {
            return _this.gameObjectHandler.getArray(arrayName)[id];
        };

        // Bounds to confine the camera into
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: 0 + this.grid.cols * this.grid.cellWidth,
            maxY: 0 + this.grid.rows * this.grid.cellHeight
        };

        this.update = function(x, y)
        {
            this.camera.updateScroll(x, y, this.bounds);

            var minPos = this.minCamPos = this.grid.getCoordinates(this.camera.boundingBox.minX, this.camera.boundingBox.minY);
            var maxPos = this.maxCamPos = this.grid.getCoordinates(this.camera.boundingBox.maxX, this.camera.boundingBox.maxY);

            this.gameObjectHandler.addToProcessList(
                this.grid,
                minPos.col, 
                minPos.row, 
                maxPos.col, 
                maxPos.row
            );

            var args = Array.prototype.slice.call(arguments);
            args.shift(2);
            this.gameObjectHandler.act.apply(this.gameObjectHandler, [this.grid].concat(args));

            this.gameObjectHandler.resetProcessList();
        };
    },
    CreateAA: require("./CreateAA.js"),
    Camera: Camera,
    CameraGrid: CameraGrid,
    GameObjectHandler: GameObjectHandler
};

module.exports = CartesianSystem;
global.CartesianSystem = CartesianSystem;