var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var config = {
    window: {
        width: canvas.width,
        height: canvas.height
    },
    grid: {
        cols: 20,
        rows: 34,
        cellWidth: 30,
        cellHeight: 30
    }
};

var world = new CartesianSystem.World(config);

var gameObjects = CartesianSystem.CreateAA([], undefined, "gameObjects");

function Block(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

var blocks = gameObjects.addObject("block", CartesianSystem.CreateAA(Block));

blocks.add(300, 127, 80, 32);
blocks.add(545, 87, 13, 42);

console.log(gameObjects);

window.setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},
1000 / 60);