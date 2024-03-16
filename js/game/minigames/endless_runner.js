import { Minigame, Obstacle } from './minigame.js'
import { Pet } from '../pet.js'

export class EndlessRunnerGame extends Minigame {
  constructor() {
    super()

    // canvas
    this.canvas.id = 'comfy-pets-runner-game'
    this.canvas.width = 700
    this.canvas.height = 400

    // assets
    this.backgroundImage.src =
      'https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY='

    // Physics values
    this.gravity = 0.3
    this.initialJumpVelocity = -8 // Initial jump velocity value

    // player
    this.blueRect = new Pet({
      x: 50,
      y: 300,
      width: 75,
      height: 50,
    })
    this.blueRect.direction = 'right'
    this.blueRect.isJumping = false
    this.blueRect.velocityY = this.initialJumpVelocity

    // enemies
    this.redRectangleCooldown = 0
    this.baseRedRectangleSpeed = 5

    // Start loading screen
    //this.renderLoadingScreen();
    this.startGame()
    this.renderCount = 0
  }

  startGame() {
    const handleKeyDown = (event) => {
      if (event.key === ' ' && this.blueRect.isJumping == false) {
        this.blueRect.velocityY = this.initialJumpVelocity
        this.blueRect.isJumping = true
      }
    }

    const handleKeyUp = () => {}

    this.isPaused = false
    this.eventListeners = {
      keydown: handleKeyDown,
      keyup: handleKeyUp,
    }

    for (const [type, listener] of Object.entries(this.eventListeners)) {
      document.addEventListener(type, listener)
    }

    this.render()
  }

  createRectangle() {
    return new Obstacle({
      x: this.canvas.width, // Start from the right side of the canvas
      y: 300, // Initial y-coordinate
      width: 75,
      height: 50,
    })
  }

  renderPlayer() {
    // Draw pet
    try {
      this.blueRect.renderRun(this.context, this.renderCount, 5)
      /*
      this.context.drawImage(
        this.blueRect.petGif.image,     // img src
        this.blueRect.x,                // x
        this.blueRect.y,                // y
        this.blueRect.width,            // width
        this.blueRect.height            // height
      );
      */
    } catch (e) {
      // @hotfix - gif loader throws an error
    }
  }

  renderObstacles() {
    // Draw and update red rectangles
    for (var i = 0; i < this.redRectangles.length; i++) {
      var redRect = this.redRectangles[i]
      //this.context.fillStyle = '#FF0000';
      //this.context.fillRect(redRect.x, redRect.y, redRect.width, redRect.height);

      try {
        this.context.drawImage(
          redRect.image, // img src
          redRect.x, // x
          redRect.y, // y
          redRect.width, // width
          redRect.height, // height
        )
      } catch (e) {
        // @hotfix - gif loader throws an error
      }

      // Rectangle speeds
      redRect.x -= this.baseRedRectangleSpeed + this.score * 0.1

      // Remove red rectangles that are out of the scene
      if (redRect.x < -20) {
        this.redRectangles.splice(i, 1)
        i--
        this.score++
      }
    }

    // Generate a new rectangle periodically if its cooldown is over
    if (this.redRectangleCooldown <= 0) {
      this.redRectangles.push(this.createRectangle())
      this.redRectangleCooldown = (50 - this.score * 0.5) * (1 + Math.random())
    } else {
      this.redRectangleCooldown--
    }
  }

  renderOneFrame = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.renderBackground()

    this.renderObstacles()
    this.renderPlayer()

    // Handle jump
    if (this.blueRect.isJumping) {
      this.blueRect.velocityY += this.gravity
      this.blueRect.y += this.blueRect.velocityY

      // check ground collision
      if (this.blueRect.y >= 300) {
        this.keyDownTime = null
        this.keyHoldDuration = null

        this.blueRect.y = 300
        this.blueRect.velocityY = this.initialJumpVelocity
        this.blueRect.isJumping = false
      }
    }
  }

  /**
   * Main loop
   */
  render = () => {
    this.renderOneFrame()

    if (
      this.redRectangles.length > 0 &&
      this.blueRect.isTouching(this.redRectangles[0])
    ) {
      this.togglePause()
      this.renderDefeatScreen()
    } else {
      this.context.fillStyle = 'white'
      this.context.font = `bold 24px Courier New`
      this.context.fillText('Press space to jump', 0, 50)
      this.context.fillText('Score: ' + this.score, 0, 100)
    }

    // Request the next animation frame
    if (!this.isPaused) {
      this.animationId = requestAnimationFrame(this.render)
    }

    this.renderCount++
  }
}
