var CreateAA = require("./CreateAA.js");
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

        this.cameraGrid = new CameraGrid(
            config.grid.cols, 
            config.grid.rows, 
            config.grid.cellWidth,
            config.grid.cellHeight
        );

        this.gameObjectHandler = new GameObjectHandler();

        this.init = function()
        {
            this.cameraGrid.reset();

            return this;
        };

        var _this = this;
        this.add = {};
        this.add.gameObjectArray = function(object, arrayName)
        {
            if(arrayName === undefined) 
            { 
                arrayName = object.name.charAt(0).toLowerCase() + object.name.slice(1); 
            }

            var array = _this.gameObjectHandler.addArray(arrayName, CreateAA(object, undefined, arrayName));

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
            _this.cameraGrid.addReference(gameObject);
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

        this.remove = {};
        this.remove.gameObjectArray = function(arrayName)
        {
            _this.cameraGrid.removeAll(arrayName);
            gameObjectHandler.removeArray(arrayName);
            return this;
        };
        this.remove.gameObject = function(arrayName, id)
        {
            var gameObjectArray = _this.gameObjectHandler.getArray(arrayName);
            _this.cameraGrid.removeReference(gameObjectArray[id]);
            gameObjectArray.remove(id);
            return this;
        };

        // Bounds to confine the camera into
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: 0 + this.cameraGrid.cols * this.cameraGrid.cellWidth,
            maxY: 0 + this.cameraGrid.rows * this.cameraGrid.cellHeight
        };

        this.loopThroughVisibleCells = function(callback)
        {
            var minPos = this.minCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.minX, this.camera.boundingBox.minY);
            var maxPos = this.maxCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.maxX, this.camera.boundingBox.maxY);

            this.cameraGrid.loopThroughCells( 
                minPos.col,
                minPos.row,
                maxPos.col,
                maxPos.row, 
                callback
            );
        };

        this.updateProcessList = function()
        {
            var minPos = this.minCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.minX, this.camera.boundingBox.minY);
            var maxPos = this.maxCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.maxX, this.camera.boundingBox.maxY);

            this.gameObjectHandler.addToProcessList(
                this.cameraGrid,
                minPos.col,
                minPos.row,
                maxPos.col,
                maxPos.row
            );
        };

        this.loopProcessList = function(callback)
        {
            this.gameObjectHandler.loopProcessList(this.cameraGrid, callback);
        };

        this.resetProcessList = function()
        {
            this.gameObjectHandler.resetProcessList();
        };

        this.update = function(x, y)
        {
            this.camera.updateScroll(x, y, this.bounds);

            var minPos = this.minCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.minX, this.camera.boundingBox.minY);
            var maxPos = this.maxCamPos = this.cameraGrid.getCoordinates(this.camera.boundingBox.maxX, this.camera.boundingBox.maxY);

            // Bail if we don't have enough arguments to suffice `GameObjecthandler#act`
            if(arguments.length <= 2)
            {
                return;
            }

            this.gameObjectHandler.addToProcessList(
                this.cameraGrid,
                minPos.col,
                minPos.row,
                maxPos.col,
                maxPos.row
            );

            var inputArgs = Array.prototype.slice.call(arguments).slice(2);

            for(var i = 0; i < inputArgs.length; i++)
            {
                this.gameObjectHandler.act.apply(this.gameObjectHandler, [this.cameraGrid].concat(inputArgs[i]));
            }

            this.gameObjectHandler.resetProcessList();
        };
    },
    CreateAA: CreateAA,
    Camera: Camera,
    CameraGrid: CameraGrid,
    GameObjectHandler: GameObjectHandler
};

module.exports = CartesianSystem;
global.CartesianSystem = CartesianSystem;