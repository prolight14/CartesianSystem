var world = new CartesianSystem.World();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

window.setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},
1000 / 60);