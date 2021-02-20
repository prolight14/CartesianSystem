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
        cellWidth: 200,
        cellHeight: 200
    }
};

var world = new CartesianSystem.World(config).init();

window.setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";

    world.update(canvas.width / 2, canvas.height / 2);

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
},
1000 / 60);