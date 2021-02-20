function Camera(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    this.scrollX = x + this.halfWidth;
    this.scrollY = y + this.halfHeight;

    this.boundingBox = {
        minX: this.scrollX - this.halfWidth,
        minY: this.scrollY - this.halfHeight,
        maxX: this.scrollX + this.halfWidth,
        maxY: this.scrollY + this.halfHeight
    };

    this.updateScroll = function(x, y, bounds)
    {
        // Update scroll
        this.scrollX = Math.min(Math.max(x, bounds.minX + this.halfWidth), bounds.maxX - this.halfWidth);
        this.scrollY = Math.min(Math.max(y, bounds.minY + this.halfHeight), bounds.maxY - this.halfHeight);

        // Update boundingBox
        this.boundingBox.minX = this.scrollX - this.halfWidth;
        this.boundingBox.minY = this.scrollY - this.halfHeight;
        this.boundingBox.maxX = this.scrollX + this.halfWidth;
        this.boundingBox.maxY = this.scrollY + this.halfHeight;
    };
}

module.exports = Camera;