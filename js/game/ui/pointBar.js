import { GameObject } from "../core.js";

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
    this.lineSpacing = this.height / this.maxPoints;
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

  render(ctx) {
    ctx.fillStyle = this.colour;
    for (let i = 0; i < this.currentPoints; i++) {
      const lineY = this.y + i * this.lineSpacing;
      ctx.fillRect(this.x, lineY, this.width, this.lineSpacing * 0.75);
    }
  }
}
