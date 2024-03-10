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

export function startGame() {
  var canvas = document.createElement('canvas');
  canvas.id = 'myCanvas';
  canvas.width = 700;
  canvas.height = 400;

  var context = canvas.getContext('2d');

  // Variables for red rectangles
  var redRectangles = [];

  let keyDownTime;
  let keyHoldDuration;

  var animationId;
  var isPaused = false;

  // Blue rectangle variables
  var blueRect = new Pet({
    x: 50,
    y: 300,
    width: 75,
    height: 50,
  });

  blueRect.direction = "right"
  blueRect.isJumping = false


  // Function to create a new rectangle
  function createRectangle() {
    return new Obstacle({
        x: canvas.width,  // Start from the right side of the canvas
        y: 300,            // Initial y-coordinate
        width: 100,
        height: 100,
        //space: getRandomSpace()  // Varying space between rectangles
    });
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update red rectangles
    for (var i = 0; i < redRectangles.length; i++) {
      var redRect = redRectangles[i];
      context.fillStyle = '#FF0000';
      context.fillRect(redRect.x, redRect.y, redRect.width, redRect.height);

      redRect.x -= 2; // Adjust the speed of movement

      // Remove red rectangles that are out of the scene
      if (redRect.x < -20) {
        redRectangles.splice(i, 1);
        i--; // Adjust the index after removing an element
      }
    }

    // Generate a new rectangle periodically
    if (Math.random() < 0.02) {  // Adjust the probability as needed
      redRectangles.push(createRectangle());
    }


    // Draw and update blue rectangle
    //context.fillStyle = '#0000FF';
    //context.fillRect(blueRect.x, blueRect.y, blueRect.width, blueRect.height);

    try {
      context.drawImage(
        blueRect.petGif.image,     // img src
        blueRect.x,                // x
        blueRect.y,                // y
        blueRect.width,            // width
        blueRect.height            // height
      );
    } catch (e) {
      // @hotfix - gif loader throws an error
      console.log(e)
    }

    keyHoldDuration = new Date() - keyDownTime;
    // Check if the blue rectangle is jumping
    if (blueRect.isJumping) {
        blueRect.y -= 5; // Move up //-= Math.sin(1/10 * keyHoldDuration)// 
    } else if (blueRect.y < 300) {
        blueRect.y += 5; // Move down until it reaches the initial position
    }

    if (redRectangles.length > 0 && blueRect.isTouching(redRectangles[0])) {
      console.log("you lost")
      togglePause();
    }


    // Request the next animation frame
    if (!isPaused) {
      animationId = requestAnimationFrame(draw);
    }
  }



  function handleKeyDown(event) {
    if (event.key === ' ') {
      blueRect.isJumping = true;
      keyDownTime = new Date();
    } else if (event.key === 'p' || event.key === 'P') {
      togglePause();
    } else if (event.key === 'e' || event.key === 'E') {
      endGame();
    }
  }

  function handleKeyUp(event) {
    if (event.key === ' ') {
      blueRect.isJumping = false;
      keyHoldDuration = new Date() - keyDownTime;
      console.log(`Key held for ${keyHoldDuration / 1000} seconds`);
      console.log(`Sin ${Math.sin(keyHoldDuration)} seconds`);

      // Reset the keyDownTime for the next key press
      keyDownTime = null;
    }
  }

  // Handle spacebar press for blue rectangle jump
  document.addEventListener('keydown', handleKeyDown);

  // Handle spacebar release for blue rectangle jump
  document.addEventListener('keyup', handleKeyUp);

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      cancelAnimationFrame(animationId);
    } else {
      draw(); // Resume the animation
    }
  }

  // Start the animation
  draw();

  function endGame() {
    // Cancel animation frame
    cancelAnimationFrame(animationId);

    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Remove canvas from the document
    //document.body.removeChild(canvas);

    // Additional cleanup if needed

    alert('Game Over!'); // Display a message or perform any other end-of-game actions
  }

  return { canvas, endGame };
}



