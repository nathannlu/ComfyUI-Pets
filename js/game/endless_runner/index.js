/**
 * Implementation of an endless-runner type game.
 * Like Flappy Bird, Jetpack Joyride, etc
 * @WIP
 */
import { GameObject } from '../core.js';
import { Pet } from '../pet.js';


class Obstacle extends GameObject {
  constructor({x, y, width, height}) {
    super(x, y, width, height);

    //this.image = new Image();
    //this.image.src = "https://44.media.tumblr.com/65175cb8addf6d61d20856d12f97c963/tumblr_mrcf12B0fE1rfjowdo1_500.gif"
  }

  // Additional methods or properties specific to the player can be added here
}

export class Game {
  constructor() {
    // canvas 
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'comfy-pets-runner-game';
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext('2d');

    // game states
    // default dont start the game
    this.isPaused = true;
    this.animatonId = null
    this.eventListeners = {};

    // player
    this.blueRect = new Pet({
      x: 50,
      y: 300,
      width: 75,
      height: 50,
    });
    this.blueRect.direction = "right"
    this.blueRect.isJumping = false

    // enemies
    this.redRectangles = []
  }


  startGame() {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        this.blueRect.isJumping = true;
        this.keyDownTime = new Date();
      }
    }

    const handleKeyUp = (event) => {
      if (event.key === ' ') {
        this.blueRect.isJumping = false;
        this.keyHoldDuration = new Date() - this.keyDownTime;

        // Reset the keyDownTime for the next key press
        this.keyDownTime = null;
      }
    }

    this.isPaused = false;
    this.eventListeners = {
      'keydown': handleKeyDown,
      'keyup': handleKeyUp
    }

    for (const [type, listener] of Object.entries(this.eventListeners)) {
      document.addEventListener(type, listener);
    }

    this.render();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      cancelAnimationFrame(this.animationId);
    } else {
      this.render(); // Resume the animation
    }
  }

  endGame() {
    // Cancel animation frame
    cancelAnimationFrame(this.animationId);

    // Remove event listeners
    for (const [type, listener] of Object.entries(this.eventListeners)) {
      document.removeEventListener(type, listener);
    }

    alert('Game Over!'); // Display a message or perform any other end-of-game actions
  }


  createRectangle() {
    return new Obstacle({
      x: this.canvas.width,  // Start from the right side of the canvas
      y: 300,            // Initial y-coordinate
      width: 100,
      height: 100,
    });
  }


  render = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw and update red rectangles
    for (var i = 0; i < this.redRectangles.length; i++) {
      var redRect = this.redRectangles[i];
      this.context.fillStyle = '#FF0000';
      this.context.fillRect(redRect.x, redRect.y, redRect.width, redRect.height);

      redRect.x -= 2; // Adjust the speed of movement

      // Remove red rectangles that are out of the scene
      if (redRect.x < -20) {
        this.redRectangles.splice(i, 1);
        i--; // Adjust the index after removing an element
      }
    }

    // Generate a new rectangle periodically
    if (Math.random() < 0.02) {  // Adjust the probability as needed
      this.redRectangles.push(this.createRectangle());
    }


    // Draw and update blue rectangle
    //context.fillStyle = '#0000FF';
    //context.fillRect(blueRect.x, blueRect.y, blueRect.width, blueRect.height);

    try {
      this.context.drawImage(
        this.blueRect.petGif.image,     // img src
        this.blueRect.x,                // x
        this.blueRect.y,                // y
        this.blueRect.width,            // width
        this.blueRect.height            // height
      );
    } catch (e) {
      // @hotfix - gif loader throws an error
      console.log(e)
    }

    this.keyHoldDuration = new Date() - this.keyDownTime;
    // Check if the blue rectangle is jumping
    if (this.blueRect.isJumping) {
        this.blueRect.y -= 5; // Move up //-= Math.sin(1/10 * keyHoldDuration)// 
    } else if (this.blueRect.y < 300) {
        this.blueRect.y += 5; // Move down until it reaches the initial position
    }

    if (this.redRectangles.length > 0 && this.blueRect.isTouching(this.redRectangles[0])) {
      console.log("you lost")
      this.togglePause();
    }

    // Request the next animation frame
    if (!this.isPaused) {
      this.animationId = requestAnimationFrame(this.render);
    }
  }
}




