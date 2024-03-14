/**
 * Implementation of an endless-runner type game.
 * Like Flappy Bird, Jetpack Joyride, etc
 * @WIP
 */
import { GameObject } from "../core.js";
import { Pet } from "../pet.js";
import { MediumButton } from "../buttons.js";

class Obstacle extends GameObject {
  constructor({ x, y, width, height }) {
    super(x, y, width, height);

    this.image = new Image();
    this.image.src =
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bed37cc7-6f06-4834-99f3-65e681a17e36/deyijro-4c901a78-91d7-4d70-8660-ac5ad6f6ba02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JlZDM3Y2M3LTZmMDYtNDgzNC05OWYzLTY1ZTY4MWExN2UzNlwvZGV5aWpyby00YzkwMWE3OC05MWQ3LTRkNzAtODY2MC1hYzVhZDZmNmJhMDIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TcAzWFbLGW-nlsoMq2OJ9IzZxQVqhTPgNAk2qGeEdNc";
  }

  // Additional methods or properties specific to the player can be added here
}

export class Game {
  constructor() {
    // canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "comfy-pets-runner-game";
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");

    // assets
    this.backgroundImage = new Image();
    this.backgroundImage.src =
      "https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY=";

    // game states
    // default dont start the game
    this.isPaused = true;
    this.animatonId = null;
    this.eventListeners = {};

    // player
    this.blueRect = new Pet({
      x: 50,
      y: 300,
      width: 75,
      height: 50,
    });
    this.blueRect.direction = "right";
    this.blueRect.isJumping = false;
    this.blueRect.velocityY = 0;

    // enemies
    this.redRectangles = [];

    this.buttons = [];

    // Start loading screen
    //this.renderLoadingScreen();
    this.startGame();
    this.renderCount = 0;

    // Physics values
    this.gravity = 0.2;
    this.jumpVelocity = -6; // Initial jump velocity value
  }

  addButton(buttonText, options, callback) {
    //this.addWidget("button", buttonText, "image", callback)
    var b = new MediumButton(buttonText, "#eeaa00", "#fff");
    b.onClick = callback;
    this.buttons.push(b);

    return b;
  }

  renderLoadingScreen() {
    let img = new Image();
    img.src = this.blueRect.gifSrc;
    img.onload = () => {
      // Draw the image onto the canvas
      this.context.drawImage(
        img,
        50, // x
        200, // y
        175, // width
        150 // height
      );
    };

    this.context.fillStyle = "white";
    //this.context.textAlign = 'center';
    //this.context.textBaseline = 'middle';

    this.context.font = `bold 32px Courier New`;

    this.context.fillText("Hello world", 50, 50);

    // Render button
    const startButton = new MediumButton("Start", "#eeaa00", "#fff");
    startButton.onClick = () => {
      console.log("Hello");
      //this.startGame();
    };
    startButton.render(this.context, this.renderCount);

    //this.buttons.push(startButton)
  }

  renderDefeatScreen() {
    this.context.fillStyle = "white";
    this.context.font = `bold 32px Courier New`;
    this.context.fillText("You lost", 50, 50);
  }

  startGame() {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        this.blueRect.isJumping = true;
        // this.keyDownTime = new Date();
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " ") {
        // this.blueRect.isJumping = false;
        // this.keyHoldDuration = new Date() - this.keyDownTime;
        // Reset the keyDownTime for the next key press
        // this.keyDownTime = null;
      }
    };

    this.isPaused = false;
    this.eventListeners = {
      keydown: handleKeyDown,
      keyup: handleKeyUp,
    };

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

    console.log("Closing game");
  }

  createRectangle() {
    return new Obstacle({
      x: this.canvas.width, // Start from the right side of the canvas
      y: 300, // Initial y-coordinate
      width: 75,
      height: 50,
    });
  }

  renderPlayer() {
    // Draw pet
    try {
      this.blueRect.renderRun(this.context, this.renderCount, 5);
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
      var redRect = this.redRectangles[i];
      //this.context.fillStyle = '#FF0000';
      //this.context.fillRect(redRect.x, redRect.y, redRect.width, redRect.height);

      try {
        this.context.drawImage(
          redRect.image, // img src
          redRect.x, // x
          redRect.y, // y
          redRect.width, // width
          redRect.height // height
        );
      } catch (e) {
        // @hotfix - gif loader throws an error
      }

      // Rectangle speeds
      redRect.x -= 2;

      // Remove red rectangles that are out of the scene
      if (redRect.x < -20) {
        this.redRectangles.splice(i, 1);
        i--;
      }
    }

    // Generate a new rectangle periodically
    if (Math.random() < 0.02) {
      // Adjust the probability as needed
      this.redRectangles.push(this.createRectangle());
    }
  }

  renderOneFrame = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderBackground();

    this.renderObstacles();
    this.renderPlayer();

    // this.keyHoldDuration = new Date() - this.keyDownTime;
    // Handle jump
    if (this.blueRect.isJumping) {
      this.blueRect.velocityY += this.gravity;
      this.blueRect.y += this.blueRect.velocityY;

      // check ground collision
      if (this.blueRect.y >= 300) {
        this.blueRect.y = 300;
        this.blueRect.velocityY = this.jumpVelocity;
        this.blueRect.isJumping = false;
      }
    }

    // this.keyHoldDuration = new Date() - this.keyDownTime;
    // if (this.blueRect.isJumping) {
    //   this.blueRect.y -= 5; // Move up //-= Math.sin(1/10 * keyHoldDuration)//
    // } else if (this.blueRect.y < 300) {
    //   this.blueRect.y += 5; // Move down until it reaches the initial position
    // }
  };

  renderBackground() {
    //const [width, height] = this.size
    this.context.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Main loop
   */
  render = () => {
    this.renderOneFrame();

    if (
      this.redRectangles.length > 0 &&
      this.blueRect.isTouching(this.redRectangles[0])
    ) {
      this.togglePause();
      this.renderDefeatScreen();
    } else {
      this.context.fillStyle = "white";
      this.context.font = `bold 24px Courier New`;
      this.context.fillText("Press space to jump", 0, 50);
    }

    // Request the next animation frame
    if (!this.isPaused) {
      this.animationId = requestAnimationFrame(this.render);
    }

    this.renderCount++;
  };
}
