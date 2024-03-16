import { GameObject } from "../core.js";
import { darkenHexColor } from "../../utils.js";

export class PointBar extends GameObject {
  constructor(
    x,
    y,
    width,
    height,
    maxPoints,
    colour,
    label,
    fontSize = 14,
    fontFamily = "Courier New",
    fontWeight = "bold",
    id = null,
    initialPoints = maxPoints
  ) {
    super(x, y, width, height);
    this.maxPoints = maxPoints;
    this.currentPoints = initialPoints;
    this.colour = colour;
    this.label = label;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
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
    const padding = 15;
    ctx.fillStyle = darkenHexColor(this.colour, 50);
    ctx.beginPath();
    ctx.roundRect(
      this.x - padding,
      this.y,
      this.width + 2 * padding,
      this.height + 2 * padding,
      4
    );
    ctx.fill();

    ctx.fillStyle = this.colour;
    for (let i = 0; i < this.currentPoints; i++) {
      const lineY = this.y + this.height - i * this.lineSpacing;
      ctx.fillRect(this.x, lineY, this.width, this.lineSpacing * 0.75);
    }

    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily} `;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.label,
      this.x + this.width / 2,
      this.y + this.height + this.lineSpacing * 0.75 + 12
    );
  }
}
