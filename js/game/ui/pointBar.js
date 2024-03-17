import { GameObject } from '../core.js'
import { darkenHexColor } from '../../utils.js'

export class PointBar extends GameObject {
  constructor({
    x,
    y,
    width,
    height,
    maxPoints,
    colour,
    label,
    fontSize = 14,
    fontFamily = 'Courier New',
    fontWeight = 'bold',
    associatedId = null,
    initialPoints = maxPoints,
  }) {
    super(x, y, width, height)
    this.maxPoints = maxPoints
    this.currentPoints = initialPoints
    this.colour = colour
    this.label = label
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.fontWeight = fontWeight
    // id of gameObject to be associated with i.e. the pet
    this.associatedId = associatedId
  }

  addPoints(points) {
    this.currentPoints += points
    if (this.currentPoints > this.maxPoints) {
      this.currentPoints = this.maxPoints
    }
  }

  removePoints(points) {
    this.currentPoints -= points
    if (this.currentPoints < 0) {
      this.currentPoints = 0
    }
  }

  setPoints(points) {
    this.currentPoints = points
    if (this.currentPoints > this.maxPoints) {
      this.currentPoints = this.maxPoints
    } else if (this.currentPoints < 0) {
      this.currentPoints = 0
    }
  }

  render(ctx) {
    // Fill background box
    const padding = 15
    ctx.fillStyle = darkenHexColor(this.colour, 50)
    ctx.beginPath()
    ctx.roundRect(
      this.x - padding,
      this.y,
      this.width + 2 * padding,
      this.height + 2 * padding,
      4,
    )
    ctx.fill()

    // fill each line per point
    const lineSpacing = this.height / this.maxPoints
    ctx.fillStyle = this.colour
    for (let i = 0; i < this.currentPoints; i++) {
      const lineY = this.y + this.height - i * lineSpacing
      ctx.fillRect(this.x, lineY, this.width, lineSpacing * 0.75)
    }

    // fill label
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily} `
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      this.label,
      this.x + this.width / 2,
      this.y + this.height + lineSpacing * 0.75 + 12,
    )
  }
}
