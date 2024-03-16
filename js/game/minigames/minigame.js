/**
 * Implementation of an endless-runner type game.
 * Like Flappy Bird, Jetpack Joyride, etc
 * @WIP
 */
import { GameObject } from '../core.js'
import { MediumButton } from '../buttons.js'
import { events, EARN_COINS } from '../../events.js'

export class Obstacle extends GameObject {
  constructor({ x, y, width, height }) {
    super(x, y, width, height)

    this.image = new Image()
    this.image.src =
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bed37cc7-6f06-4834-99f3-65e681a17e36/deyijro-4c901a78-91d7-4d70-8660-ac5ad6f6ba02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JlZDM3Y2M3LTZmMDYtNDgzNC05OWYzLTY1ZTY4MWExN2UzNlwvZGV5aWpyby00YzkwMWE3OC05MWQ3LTRkNzAtODY2MC1hYzVhZDZmNmJhMDIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TcAzWFbLGW-nlsoMq2OJ9IzZxQVqhTPgNAk2qGeEdNc'
  }

  // Additional methods or properties specific to the player can be added here
}

export class Minigame {
  constructor() {
    // canvas
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    // assets
    this.backgroundImage = new Image()

    // game states
    // default dont start the game
    this.isPaused = true
    this.animatonId = null
    this.eventListeners = {}
    this.score = 0

    // enemies
    this.redRectangles = []

    this.buttons = []

    // Start loading screen
    //this.renderLoadingScreen();

    // Must run startGame at end of subclass constructor
    // this.startGame()
    // this.renderCount = 0
  }

  addButton(buttonText, options, callback) {
    //this.addWidget("button", buttonText, "image", callback)
    var b = new MediumButton(buttonText, '#eeaa00', '#fff')
    b.onClick = callback
    this.buttons.push(b)

    return b
  }

  renderLoadingScreen() {
    let img = new Image()
    img.src = this.blueRect.gifSrc
    img.onload = () => {
      // Draw the image onto the canvas
      this.context.drawImage(
        img,
        50, // x
        200, // y
        175, // width
        150, // height
      )
    }

    this.context.fillStyle = 'white'
    //this.context.textAlign = 'center';
    //this.context.textBaseline = 'middle';

    this.context.font = `bold 32px Courier New`

    this.context.fillText('Hello world', 50, 50)

    // Render button
    const startButton = new MediumButton('Start', '#eeaa00', '#fff')
    startButton.onClick = () => {
      console.log('Hello')
      //this.startGame();
    }
    startButton.render(this.context, this.renderCount)

    //this.buttons.push(startButton)
  }

  renderDefeatScreen() {
    this.context.fillStyle = 'white'
    this.context.font = `bold 32px Courier New`
    this.context.fillText('You lost', 50, 50)
    this.context.fillText('Score: ' + this.score, 50, 100)

    this.context.fillStyle = '#FFBF00'
    this.context.fillText(`+${this.score} coins`, 50, 150)

    const e = new CustomEvent(EARN_COINS, { detail: { coins: this.score } })
    events.dispatchEvent(e)
  }

  togglePause() {
    this.isPaused = !this.isPaused
    if (this.isPaused) {
      cancelAnimationFrame(this.animationId)
    } else {
      this.render() // Resume the animation
    }
  }

  endGame() {
    // Cancel animation frame
    cancelAnimationFrame(this.animationId)

    // Remove event listeners
    for (const [type, listener] of Object.entries(this.eventListeners)) {
      document.removeEventListener(type, listener)
    }

    console.log('Closing game')
  }

  createRectangle() {}

  renderPlayer() {}

  renderObstacles() {}

  renderOneFrame = () => {}

  renderBackground() {
    //const [width, height] = this.size
    this.context.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    )
  }
  /**
   * Main loop
   */
  render = () => {}
}
