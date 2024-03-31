import { Button } from '../comfy/comfy.js'
import { darkenHexColor } from '../utils.js'

/**
 * General styling
 */
export class BaseComfyPetsButton extends Button {
  constructor(text, fillColor, textColor) {
    super(text, fillColor, textColor)

    this.visible = true
  }

  render(ctx) {
    if (!this.visible) {
      return
    }
    // Darken by 10%
    const buttonFillDark = darkenHexColor(this.backgroundColor, 10)

    ctx.fillStyle = buttonFillDark
    ctx.beginPath()
    ctx.roundRect(this.x, this.y, this.width, this.height, 4) // draw the button text
    ctx.fill()

    ctx.fillStyle = this.backgroundColor
    ctx.beginPath()
    ctx.roundRect(this.x, this.y, this.width, this.height - 4, 4)
    ctx.fill()

    ctx.fillStyle = this.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (this.fontWeight == 'regular') {
      ctx.font = `${this.fontSize}px ${this.fontFamily}`
    } else {
      ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    }

    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      //this.button
    )

    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
  }
}

/**
 * Button sizes
 */
export class SmallButton extends BaseComfyPetsButton {
  constructor(text, fillColor, textColor) {
    super(text, fillColor, textColor)
    this.width = 100
    this.height = 24
  }
}
export class MediumButton extends BaseComfyPetsButton {
  constructor(text, fillColor, textColor) {
    super(text, fillColor, textColor)
    this.width = 100
    this.height = 32
  }
}
export class LargeButton extends BaseComfyPetsButton {
  constructor(text, fillColor, textColor) {
    super(text, fillColor, textColor)
    this.width = 100
    this.height = 48
  }
}
