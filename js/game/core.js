import { generateId } from '../utils.js';

export class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = generateId();
    this.isActive = true;
  }

  // Check if this object is touching another object
  isTouching(otherObject) {
    return (
      this.x < otherObject.x + otherObject.width &&
      this.x + this.width > otherObject.x &&
      this.y < otherObject.y + otherObject.height &&
      this.y + this.height > otherObject.y
    );
  }

  delete() {
    this.isActive = false;
  }
}

export class Button {
  constructor(text, fillColor, textColor) {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 48;
    this.id = generateId();
    this.text = text;
    this.textColor = textColor;
    this.fillColor = fillColor;
  }

  inBounds(mouseX, mouseY) {
    return !(mouseX < this.x || mouseX > this.x + this.width || mouseY < this.y || mouseY > this.y + this.height);
  }

  onClick() {
    // implement
  }
}
