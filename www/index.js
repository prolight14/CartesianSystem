var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var config = {
    window: {
        width: canvas.width,
        height: canvas.height
    },
    grid: {
        cols: 25,
        rows: 35,
        cellWidth: 200,
        cellHeight: 200
    }
};

var world = new CartesianSystem.World(config).init();

var Rect = function(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    var _this = this;

    this.body = {
        moves: false,
        boundingBox: {
            minX: x,
            minY: y,
            maxX: x + width,
            maxY: y + height
        },
        updateBoundingBox: function()
        {
            var box = this.boundingBox;
            box.minX = _this.x;
            box.minY = _this.y;
            box.maxX = _this.x + _this.width;
            box.maxY = _this.y + _this.height;
        }
    };
};

var Block = function(x, y, width, height, color)
{
    Rect.call(this, x, y, width, height);

    this.body.moves = true;

    var lastMoveTime = Date.now() + 5000 * Math.random();

    this.vel = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1
    };

    this.update = function()
    {
        if(Date.now() - lastMoveTime > 5000)
        {
            this.vel = { 
                x: Math.random() * 2 - 1, 
                y: Math.random() * 2 - 1 
            };
            lastMoveTime = Date.now();
        }

        this.x += this.vel.x;
        this.y += this.vel.y;

        this.body.updateBoundingBox();
    };

    this.draw = function()
    {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

var blocks = world.add.gameObjectArray(Block);

var keys = {};
function keyPressed(event)
{
    keys[event.key] = true;
}
function keyReleased(event)
{
    keys[event.key] = false;
}

window.addEventListener('keydown', keyPressed, false);
window.addEventListener('keyup', keyReleased, false);

var worldBounds = world.bounds;
for(var i = 0; i < 500; i++)
{
    var w = 150 + Math.random() * 20;
    var h = 150 + Math.random() * 20;

    blocks.add(w / 2 + Math.random() * (worldBounds.maxX - worldBounds.minX - w), h / 2 + Math.random() * (worldBounds.maxY - worldBounds.minY - h), w, h, 
    ["blue", "red", "green", "purple", "yellow"][Math.floor(Math.random() * 5)]);
}


var Player = function(x, y, width, height)
{
    Rect.call(this, x, y, width, height);

    this.color = "red";

    this.body.moves = true;

    this.update = function()
    {
        if(keys.a)
        {
            this.x -= 5;
        }
        if(keys.d)
        {
            this.x += 5;
        }
        if(keys.w)
        {
            this.y -= 5;
        }
        if(keys.s)
        {
            this.y += 5;
        }

        this.body.updateBoundingBox();
    };

    this.draw = function()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};
var players = world.add.gameObjectArray(Player);

var player1 = players.add(300, 300, 30, 30);

window.setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    var camTranslation = world.camera.getTranslation();

    ctx.translate(camTranslation.x, camTranslation.y); 

        world.update(player1.x + player1.width / 2, player1.y + player1.height / 2, "update", "draw");

        world.grid.loopThroughVisibleCells(
            world.minCamPos.col, 
            world.minCamPos.row, 
            world.maxCamPos.col, 
            world.maxCamPos.row, 
            function(cell, col, row)
            {
                ctx.strokeRect(col * config.grid.cellWidth, row * config.grid.cellHeight, config.grid.cellWidth, config.grid.cellHeight);
            }
        );

    ctx.setTransform(1, 0, 0, 1, 0, 0);
},
1000 / 60);