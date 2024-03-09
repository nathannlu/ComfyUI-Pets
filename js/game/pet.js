import { GIF } from '../libs/gif.js';
import { GameObject } from './core.js';


/**
 * Base pet class
 */
export class Pet extends GameObject {
  constructor({ x, y, height, width }) {
    super (x, y, height, width)
    // Pet state
    this.x = 0;
    this.height = height;
    this.width = width;
    this.currentDirection="right"

    this.emote = false;

    // Properties here tell when the 
    // pet to change directions. Right now
    // the pet will randomly change directions
    // after t seconds.
    this.time = 0;
    this.directionDuration = 0;


    // Assets
    this.petGif = GIF();
    this.petGif.load("https://raw.githubusercontent.com/tonybaloney/vscode-pets/master/media/dog/akita_walk_8fps.gif")
  }

  setEmote() {
    // set an emote for t seconds
    this.emote = true;

    setTimeout(() => {
      this.emote = false;
    }, 1000);
  }

  randomMovement() {
    const changeDirections = () => {
      Math.random() < 0.5 
        ? this.currentDirection = "left"
        : this.currentDirection = "right"
    }

    if (Date.now() - this.time > this.directionDuration) {
      changeDirections();
      this.time = Date.now();
      this.directionDuration = Math.random() * 4000 + 1000;
    }
  }

  move() {
    if(this.currentDirection == "right") {
      this.x += 0.5;
    }
    if(this.currentDirection == "left") {
      this.x -= 0.5;
    }
  }

  chooseDirection(foods) {
    const doesFoodExist = foods.length > 0;

    if(doesFoodExist) {
      // find nearest food
      const petPosition = this.x;

      // set attention to the food closest to it
      let nearestFood = null;
      for (let i = 0; i < foods.length; i++) {
        const foodLocation = foods[i].x;
        const displacement = Math.abs(petPosition - foodLocation);

        if (nearestFood == null) {
          nearestFood = foods[i];
        }

        if (displacement < Math.abs(petPosition - nearestFood.x)) {
          nearestFood = foods[i];
        }
      }

      // is nearest food left or right
      if(petPosition < nearestFood.x) {
        // pet is on the left of the nearest food,
        // so we move right
        this.currentDirection = "right"
      } else {
        // pet is on the right of the nearest food
        this.currentDirection = "left"
      }
       
      // see if objects interact
      if(this.isTouching(nearestFood)) {
        // Eat food
        nearestFood.delete()
        this.setEmote()
      }

    } else {
      this.randomMovement()
    }
  }
}

