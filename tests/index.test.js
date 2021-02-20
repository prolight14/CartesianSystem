let CartesianSystem = require("../src/index.js");

test("CartesianSystem.World exists", () =>
{
    expect(typeof CartesianSystem.World).toBe("function");
});

test("Externals exist", () =>
{
    expect(typeof CartesianSystem.CreateAA).toBe("function");
    expect(typeof CartesianSystem.Camera).toBe("function");
    expect(typeof CartesianSystem.CameraGrid).toBe("function");
    expect(typeof CartesianSystem.GameObjectHandler).toBe("function");
});

test("CreateAA works (basic)", () => 
{
    function GameObject(x, y)
    {
        this.x = x;
        this.y = y;

        this.draw = function()
        {

        };
    }

    var gameObjects = CartesianSystem.CreateAA(GameObject);

    expect(typeof gameObjects).toBe("object");

    var first = gameObjects.add(23, 42);

    expect(gameObjects.length).toBe(1);

    gameObjects.add(19, 87);
    gameObjects.remove(first._id);

    expect(gameObjects.length).toBe(1);
});

test("CreateAA works with arrays", () =>
{
    var gameObjects = CartesianSystem.CreateAA([], undefined, "gameObjects");
});