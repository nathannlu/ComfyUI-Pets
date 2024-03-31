//import { GIF } from "../libs/gif.js";
import { GameObject } from './core.js'
import { getCurrentPet, setPetAge } from '../apiClient.js'

const BABY_CORGI =
  'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/babycorgi-sprite-128x128.png'
const TEEN_CORGI =
  'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/teencorgi-sprite-128x128.png'
const ADULT_CORGI =
  'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/corgi-sprite-128x128.png'

// Our sprite sheet is on a grid of 64pxs
// Each row is 64px tall, and each frame is 64px wide
const SPRITE_SIZE = 128
const SPRITE_SHEET = {
  JUMP: {
    row: 0,
    frames: 11,
  },
  IDLE1: {
    row: 1,
    frames: 5,
  },
  IDLE2: {
    row: 2,
    frames: 5,
  },
  SIT: {
    row: 3,
    frames: 9,
  },
  WALK: {
    row: 4,
    frames: 5,
  },
  RUN: {
    row: 5,
    frames: 8,
  },
  SNIFF: {
    row: 6,
    frames: 8,
  },
  SNIFF_WALK: {
    row: 7,
    frames: 8,
  },
}

/**
 * Base pet class
 */
export class Pet extends GameObject {
  constructor({ x, y, height, width }) {
    super(x, y, height, width)
    // Pet state
    this.x = x
    this.currentDirection = 'right'

    this.height = height
    this.width = width

    this.emote = false
    this.talk = false
    this.talkText = ''

    this.hungerPoints = 10
    this.lastHungerDepletionTime = Date.now() // ms; sets the last time the pet's hunger dropped 1 point
    this.hungerDepletionRate = 43200000 // ms; how often the pet's hunger drops 1 point. This is 1/10 of 5 days

    // Properties here tell when the
    // pet to change directions. Right now
    // the pet will randomly change directions
    // after t seconds.
    this.time = 0
    this.directionDuration = 0

    // Assets
    this.petImage = new Image()
    this.petImage.src =
      'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/babycorgi-sprite-128x128.png'

    this.textBubble = new Image()
    this.textBubble.src =
      'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/text-bubble.png'

    this.age = 0
    this._initializePet()
  }

  async _initializePet() {
    const petData = await getCurrentPet()
    console.log(petData)
    for (const key in petData) {
      this[key] = petData[key]
    }
  }

  /**
   * Creates a list of animations from a spritesheet
   * - e.g. renderWalk, renderSniff_walk, renderIdle1
   */
  createSpriteAnimations(image, scaleDownBy) {
    Object.keys(SPRITE_SHEET).forEach((animName) => {
      // transform name to title case
      // FUNC1 -> Func1
      const titleCase =
        animName.charAt(0).toUpperCase() + animName.slice(1).toLowerCase()
      const funcName = `render${titleCase}`

      const spriteFrames = SPRITE_SHEET[animName].frames
      const spriteFramesY = SPRITE_SHEET[animName].row
      this[funcName] = (ctx, renderCount, slowFpsBy = 10) => {
        this.renderSpriteAnimation(
          ctx,
          image,
          {
            renderCount,
            spriteFrames: spriteFrames - 1,
            spriteFramesY,
            slowFpsBy,
          },
          {
            scaleDownBy,
          },
        )
      }
    })
  }

  grow() {
    if (this.age < 2) {
      this.age++
      setPetAge(this.age)
    }
  }

  _chooseRandomDirection() {
    const directions = ['left', 'right', 'idle1', 'idle2']

    const changeDirections = () => {
      const randomIndex = Math.floor(Math.random() * directions.length)
      this.currentDirection = directions[randomIndex]
    }

    if (Date.now() - this.time > this.directionDuration) {
      changeDirections()
      this.time = Date.now()
      this.directionDuration = Math.random() * 4000 + 1000
    }
  }

  // debug function
  _showHitBox(ctx) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(
      this.x, // x
      this.y,
      this.width,
      this.height,
    )
  }

  renderOnTop(ctx) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(
      this.x, // x
      this.y - this.height,
      this.width,
      this.height,
    )
  }

  setEmote() {
    // set an emote for t seconds
    this.emote = true

    setTimeout(() => {
      this.emote = false
    }, 1000)
  }

  setTalk(text, duration = 1000) {
    // set an emote for t seconds
    this.talk = true
    this.talkText = text

    setTimeout(() => {
      this.talk = false
    }, duration)
  }

  onClick() {
    this.setTalk('Woof!')
  }

  updateHunger() {
    const timeElapsed = Date.now() - this.lastHungerDepletionTime

    if (timeElapsed > this.hungerDepletionRate) {
      // calculate amount of points to deplete
      const pointsToDeplete = Math.floor(timeElapsed / this.hungerDepletionRate)

      this.hungerPoints -= pointsToDeplete
      this.lastHungerDepletionTime = Date.now()

      // Check death condition
      if (this.hungerPoints <= 0) {
        this.hungerPoints = 0
      }

      return this.hungerPoints
    }
    return null
  }

  move(ctx, renderCount) {
    switch (this.currentDirection) {
      case 'right':
        this.x += 0.5
        this.renderWalk(ctx, renderCount)
        break

      case 'left':
        this.x -= 0.5
        this.renderWalk(ctx, renderCount)
        break

      case 'sniff_walk':
        this.renderSniff_walk(ctx, renderCount)
        break

      case 'idle1':
        this.renderIdle1(ctx, renderCount)
        break

      case 'idle2':
        this.renderIdle2(ctx, renderCount)
        break

      default:
        this.renderIdle2(ctx, renderCount)
    }
  }

  chooseDirection(foods) {
    const doesFoodExist = foods.length > 0

    if (doesFoodExist) {
      // find nearest food
      const petPosition = this.x

      // set attention to the food closest to it
      let nearestFood = null
      for (let i = 0; i < foods.length; i++) {
        const foodLocation = foods[i].x
        const displacement = Math.abs(petPosition - foodLocation)

        if (nearestFood == null) {
          nearestFood = foods[i]
        }

        if (displacement < Math.abs(petPosition - nearestFood.x)) {
          nearestFood = foods[i]
        }
      }

      // is nearest food left or right
      if (petPosition < nearestFood.x) {
        // pet is on the left of the nearest food,
        // so we move right
        this.currentDirection = 'right'
      } else {
        // pet is on the right of the nearest food
        this.currentDirection = 'left'
      }

      // see if objects interact
      if (this.isTouching(nearestFood)) {
        this.grow()

        // Eat food
        nearestFood.delete()
        this.setEmote()
      }
    } else {
      this._chooseRandomDirection()
    }
  }

  renderSpriteAnimation(ctx, spriteSheet, frameSettings, options) {
    const {
      renderCount,
      spriteFrames,
      spriteFramesY,
      slowFpsBy: _slowFpsBy, // Slows down fps by n amount
    } = frameSettings

    let slowFpsBy = _slowFpsBy || 10

    const { scaleDownBy } = options

    const _spriteFramesY = SPRITE_SIZE * spriteFramesY
    const spriteRenderSize = SPRITE_SIZE / scaleDownBy // This is the final size users see the sprite as
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // There is 5 frames in the sprite sheet for walking
    // so instead of doing this.renderCount % 4 (0 - 5 frames),
    // we do 0 - 50 frames and scale down for a lower image fps.
    const _frame = renderCount % (spriteFrames * slowFpsBy)
    const frame = Math.round(_frame / slowFpsBy)

    const currentRenderFrame = SPRITE_SIZE * frame

    // Offset
    const offsetX = (spriteRenderSize - this.width) / 2
    const offsetY = (spriteRenderSize - this.height) / 2

    if (this.currentDirection == 'left') {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(
        spriteSheet,
        currentRenderFrame,
        _spriteFramesY,
        SPRITE_SIZE,
        SPRITE_SIZE,
        -this.x - spriteRenderSize + offsetX,
        this.y - offsetY,
        spriteRenderSize,
        spriteRenderSize,
      )
      ctx.restore()
    } else {
      ctx.drawImage(
        spriteSheet,
        currentRenderFrame,
        _spriteFramesY,
        SPRITE_SIZE,
        SPRITE_SIZE,
        this.x - offsetX,
        this.y - offsetY,
        spriteRenderSize,
        spriteRenderSize,
      )
    }
  }

  renderTextBubble(ctx) {
    ctx.fillStyle = 'black'
    ctx.font = '14px Courier New'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const textBubbleWidth = 70
    const textBubbleHeight = 40
    if (this.currentDirection == 'left') {
      const textBubbleX = -this.x - this.width + textBubbleWidth
      const textBubbleY = this.y - textBubbleHeight
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(
        this.textBubble,
        textBubbleX,
        textBubbleY,
        textBubbleWidth,
        textBubbleHeight,
      )
      ctx.restore()

      // Calculate text position
      const textX = this.x - textBubbleWidth / 2
      const textY = textBubbleY + textBubbleHeight / 2

      ctx.fillText(this.talkText, textX, textY)
    } else {
      // this includes idle, and everything
      // else at the moment
      const textBubbleX = this.x + this.width
      const textBubbleY = this.y - textBubbleHeight

      ctx.drawImage(
        this.textBubble,
        textBubbleX,
        textBubbleY,
        textBubbleWidth,
        textBubbleHeight,
      )

      const textX = textBubbleX + textBubbleWidth / 2
      const textY = textBubbleY + textBubbleHeight / 2

      ctx.fillText(this.talkText, textX, textY)
    }
  }

  render(ctx, renderCount) {
    switch (this.age) {
      case 0:
        this.petImage.src = BABY_CORGI
        this.scaleDownBy = 1.5

        break
      case 1:
        this.petImage.src = TEEN_CORGI
        this.scaleDownBy = 1.2

        break
      case 2:
        this.petImage.src = ADULT_CORGI
        this.scaleDownBy = 1

        break
    }

    //height = this.height / this.scaleDownBy
    //width = this.width / this.scaleDownBy
    this.createSpriteAnimations(this.petImage, this.scaleDownBy)

    // render emote
    if (this.emote) {
      ctx.fillStyle = 'blue'
      ctx.font = '10px Arial'
      ctx.fillText('❤️', this.x + this.width, this.y)
    }

    // render emote
    if (this.talk) {
      this.renderTextBubble(ctx)
    }

    // move the pet
    this._showHitBox(ctx)
    this.move(ctx, renderCount)
  }
}
