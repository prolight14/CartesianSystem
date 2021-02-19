let CartesianSystem = require("../src/index.js");

test("CartesianSystem.World exists", () =>
{
    expect(typeof CartesianSystem.World).toBe("function");
});