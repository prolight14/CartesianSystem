var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var config = {
    window: {
        x: 60,
        y: 34,
        width: canvas.width - 120,
        height: canvas.height - 68
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

    this.bodyConf = {
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

    this.bodyConf.moves = true;

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

        this.bodyConf.updateBoundingBox();
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

function random(min, max)
{
    return min + Math.random() * (max - min);
}

var worldBounds = world.bounds;
for(var i = 0; i < 500; i++)
{
    var w = 150 + Math.random() * 20;
    var h = 150 + Math.random() * 20;

    blocks.add(
        w / 2 + Math.random() * (worldBounds.maxX - worldBounds.minX - w),
        h / 2 + Math.random() * (worldBounds.maxY - worldBounds.minY - h), 
        random(40, 80) * 3, 
        random(40, 80) * 3,
        ["blue", "red", "green", "purple", "yellow"][Math.floor(Math.random() * 5)]
    );
}

var Player = function(x, y, width, height)
{
    Rect.call(this, x, y, width, height);

    this.color = "red";

    this.bodyConf.moves = true;

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

        this.bodyConf.updateBoundingBox();
    };

    this.draw = function()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};
var players = world.add.gameObjectArray(Player);

var player1 = players.add(300, 300, 30, 30);

var mouse = {
    x: -1,
    y: -1
};

window.setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#03B1D1";

    ctx.strokeRect(world.camera.x, world.camera.y, world.camera.width, world.camera.height);
    ctx.strokeStyle = "white";

    var camTranslation = world.camera.getTranslation();
    ctx.translate(camTranslation.x, camTranslation.y); 

        world.update(player1.x + player1.width / 2, player1.y + player1.height / 2, "update", "draw");

        world.loopThroughVisibleCells(
            function(cell, col, row)
            {
                if(mouse.isDown)
                {
                    for(var i in cell)
                    {
                        var object = world.get.gameObject(cell[i].arrayName, cell[i].id);

                        var tx, ty;

                        tx = world.camera.scrollX - world.camera.halfWidth - world.camera.x + mouse.x;
                        ty = world.camera.scrollY - world.camera.halfHeight - world.camera.y + mouse.y;

                        if(tx > object.bodyConf.boundingBox.minX && ty > object.bodyConf.boundingBox.minY && 
                        tx < object.bodyConf.boundingBox.maxX && ty < object.bodyConf.boundingBox.maxY)
                        {
                            world.remove.gameObject(object._arrayName, object._id);
                        }
                    }
                }

                ctx.strokeRect(col * config.grid.cellWidth, row * config.grid.cellHeight, config.grid.cellWidth, config.grid.cellHeight);
            }
        );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
},
1000 / 60);

var setMouse = (event) =>
{
    var rect = canvas.getBoundingClientRect();
    mouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};

document.addEventListener("mousemove", setMouse); 
document.addEventListener("mousedown", (event) =>
{
    setMouse(event);
    mouse.isDown = true;
}); 
document.addEventListener("mouseup", (event) =>
{
    setMouse(event);
    mouse.isDown = false;
}); 