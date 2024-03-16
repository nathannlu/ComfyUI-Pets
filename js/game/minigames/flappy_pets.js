import { Minigame, Obstacle } from './minigame.js'
import { Pet } from '../pet.js'

export class FlappyGame extends Minigame {
  constructor() {
    super()
    // canvas
    this.canvas.id = 'comfy-pets-flappy-game'
    this.canvas.width = 400
    this.canvas.height = 500

    // assets
    this.backgroundImage.src =
      'https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY='

    // Physics values
    this.gravity = 0.8
    this.initialJumpVelocity = -11 // Initial jump velocity value
    this.floor = 375

    // player
    this.blueRect = new Pet({
      x: 75,
      y: this.floor,
      width: 75,
      height: 50,
    })
    this.blueRect.direction = 'right'
    this.blueRect.isJumping = false
    this.blueRect.velocityY = this.initialJumpVelocity

    // enemies
    this.redRectangleCooldown = 0
    this.baseRedRectangleSpeed = 3

    // Start loading screen
    //this.renderLoadingScreen();
    this.startGame()
    this.renderCount = 0
  }

  startGame() {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
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
    const imgSrc =
      'https://upload.wikimedia.org/wikipedia/commons/9/93/Mario_pipe.png'

    const gapHeight = 85
    const obstacleWidth = 75
    const bufferHeight = 20 // Buffer height for obstacle at the top

    const minGapPosition = bufferHeight + gapHeight // Ensure a buffer at the top
    const maxGapPosition = this.canvas.height - gapHeight - gapHeight // Maximum gap position

    const gapPosition =
      Math.floor(Math.random() * (maxGapPosition - minGapPosition + 1)) +
      minGapPosition

    const topRect = new Obstacle({
      width: obstacleWidth,
      height: gapPosition - gapHeight, // Height of the top obstacle
      x: this.canvas.width, // Start from the right side of the canvas
      y: 0, // Initial y-coordinate for the top obstacle
    })
    topRect.flipped = true
    topRect.scoreCollected = false
    topRect.image.src = imgSrc

    const bottomRect = new Obstacle({
      width: obstacleWidth,
      height: this.floor - gapPosition, // Height of the bottom obstacle
      x: this.canvas.width, // Start from the right side of the canvas
      y: gapPosition + gapHeight, // Initial y-coordinate for the bottom obstacle
    })
    bottomRect.scoreCollected = false
    bottomRect.image.src = imgSrc

    return [topRect, bottomRect] // Return both obstacles as an array
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
        if (redRect.flipped) {
          this.context.save()
          this.context.translate(
            redRect.x + redRect.width / 2,
            redRect.y + redRect.height / 2,
          )
          this.context.scale(1, -1) // Scale vertically by -1 (flip vertically)
          this.context.drawImage(
            redRect.image,
            -redRect.width / 2,
            -redRect.height / 2,
            redRect.width,
            redRect.height,
          ) // Draw the flipped obstacle
          this.context.restore() // Restore the saved state of the context
        } else {
          this.context.drawImage(
            redRect.image, // img src
            redRect.x, // x
            redRect.y, // y
            redRect.width, // width
            redRect.height, // height
          )
        }
      } catch (e) {
        // @hotfix - gif loader throws an error
      }

      // Rectangle speeds
      redRect.x -= this.baseRedRectangleSpeed

      // Remove red rectangles that are out of the scene
      if (redRect.x < -20) {
        this.redRectangles.splice(i, 1)
        i--
      }

      // Update score
      if (redRect.x < 70 && redRect.scoreCollected == false) {
        this.score += 0.5
        redRect.scoreCollected = true
      }
    }

    // Generate a new rectangle periodically if its cooldown is over
    if (this.redRectangleCooldown <= 0) {
      const rectangles = this.createRectangle()
      this.redRectangles.push(...rectangles)
      this.redRectangleCooldown = 75
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
    if (this.blueRect.y <= 0) {
      this.blueRect.velocityY = -this.blueRect.velocityY
      this.blueRect.y = 5
    } else if (this.blueRect.isJumping) {
      this.blueRect.velocityY += this.gravity
      this.blueRect.y += this.blueRect.velocityY

      // check ground collision
      if (this.blueRect.y >= this.floor) {
        this.keyDownTime = null
        this.keyHoldDuration = null

        this.blueRect.y = this.floor
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

    const defeated = this.redRectangles.some((redRect) =>
      this.blueRect.isTouching(redRect),
    )

    if (this.redRectangles.length > 0 && defeated) {
      this.togglePause()
      this.renderDefeatScreen()
    } else {
      this.context.fillStyle = 'white'
      this.context.font = `bold 24px Courier New`
      this.context.fillText('Press space to fly', 0, 50)
      this.context.fillText('Score: ' + this.score, 0, 100)
    }

    // Request the next animation frame
    if (!this.isPaused) {
      this.animationId = requestAnimationFrame(this.render)
    }

    this.renderCount++
  }
}
