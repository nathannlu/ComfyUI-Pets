import { GameObject } from "../core";

export class PointBar extends GameObject {
  constructor(x, y, width, height, maxPoints, label, colour, id = null) {
    super(x, y, width, height);
    this.maxPoints = maxPoints;
    this.currentPoints = maxPoints;
    this.label = label;
    this.colour = colour;
    // id of gameObject to be associated with i.e. the pet
    this.id = id;
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
    ctx.fillStyle = colour;
    ctx.fillRect(
      this.x,
      this.y,
      (this.currentPoints / this.maxPoints) * this.width,
      this.height
    );
  }
}
