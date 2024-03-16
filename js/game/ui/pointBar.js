export class PointBar extends GameObject {
  constructor(
    x,
    y,
    width,
    height,
    maxPoints,
    label,
    colour,
    id = null,
    initialPoints = maxPoints
  ) {
    super(x, y, width, height);
    this.maxPoints = maxPoints;
    this.currentPoints = initialPoints;
    this.label = label;
    this.colour = colour;
    // id of gameObject to be associated with i.e. the pet
    this.id = id;
    // spacing for each point
    this.lineSpacing = this.width / this.maxPoints;
  }

  addPoints(points) {
    this.currentPoints += points;
    if (this.currentPoints > this.maxPoints) {
      this.currentPoints = this.maxPoints;
    }
  }

  removePoints(points) {
    this.currentPoints -= points;
    if (this.currentPoints < 0) {
      this.currentPoints = 0;
    }
  }

  setPoints(points) {
    this.currentPoints = points;
    if (this.currentPoints > this.maxPoints) {
      this.currentPoints = this.maxPoints;
    } else if (this.currentPoints < 0) {
      this.currentPoints = 0;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;

    // Draw lines representing each point
    for (let i = 0; i < this.currentPoints; i++) {
      const lineX = this.x + i * this.lineSpacing;
      ctx.fillRect(lineX, this.y, 1, this.height);
    }
  }
}
