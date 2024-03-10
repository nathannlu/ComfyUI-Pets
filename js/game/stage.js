import { ComfyNode, app } from '../comfy/comfy.js';
//import { gameDialog } from '../comfy/ui.js';
import { getRandomNumber } from '../utils.js';
import { Button } from './core.js';
import { Pet } from './pet.js';
import { Food } from './food.js';
//import { startGame } from './endless_runner/index.js';
//import { addFoodEvent } from '../apiClient.js';

var test = new Button("Hello world", '#eeaa00', '#001122')
test.onClick = () => {
  console.log("hello world")
}



/**
 * Describes the main game environment 
 */
export class ComfyPetsStage extends ComfyNode {

  constructor() {
    super()

    this.title = "Comfy Pet",
      /*
    this.addButton("Feed pet", () => {
      this.addFood()
      addFoodEvent()
    })
    */

    this.buttons = [
      test
    ]

    /*
    // @todo
    this.addButton("Play", () => {
      const { canvas, endGame } = startGame()
      gameDialog.close = endGame;
      gameDialog.show(canvas)
    })
    */

    // Stage objects
    this.pets = [];
    this.foods = [];

    // Assets
    this.backgroundImage = new Image();
    this.backgroundImage.src = "https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY="
  }

  addPet() {
    const [height] = this.size
    const petWidth = 75;
    const petHeight = 50;

    const pet = new Pet({
      x: 0,
      y: height - petHeight,
      width: petWidth,
      height: petHeight,
    })

    this.pets.push(pet)
  }

  addFood() {
    const [width, height] = this.size
    const foodWidth = 25;
    const foodHeight = 25;

    // choose a random inbetween the bounding box
    const foodPos = getRandomNumber(0, width - foodWidth)

    const food = new Food({
      x: foodPos,
      y: height - foodHeight,
      width: foodWidth,
      height: foodHeight,
    });

    this.foods.push(food)
  }

  renderPets(ctx) {
    const [width, height] = this.size

    for (let i = 0; i < this.pets.length; i++) {
      const pet = this.pets[i];

      // Delete inactive frames
      if (!pet.isActive) {
        this.pets.splice(i, 1);
      }

      // choose directions
      pet.chooseDirection(this.foods)

      // choose directions - handle if pet walks off the map
      if(pet.x > width - 75) {
        pet.currentDirection = "left"
      }
      if(pet.x < 0) {
        pet.currentDirection = "right"
      }

      // move the pet
      pet.move()

      // render emote
      if(pet.emote) {
        console.log("Emote!", pet.x, pet.y, pet.height)
        ctx.fillStyle = "blue";
        ctx.font = "10px Arial";
        ctx.fillText('❤️', pet.x + pet.width, pet.y);
      }

      try {
        ctx.drawImage(
          pet.petGif.image,     // img src
          pet.x,                // x
          height - pet.height,  // y
          pet.width,            // width
          pet.height            // height
        );
      } catch (e) {
        // @hotfix - gif loader throws an error
      }
    }
  }

  renderFoods(ctx) {
    const [height] = this.size

    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i]

      if(!food.isActive) {
        this.foods.splice(i, 1);
      }

      //ctx.fillStyle = "blue";
      ctx.drawImage(
        food.image,
        food.x,
        height - food.height,
        food.width,
        food.height
      );
    }
  }

  renderBackground(ctx) {
    const [width, height] = this.size
    ctx.drawImage(this.backgroundImage, 0, 0, width, height);
  }

  renderButtons(ctx) {
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];

      ctx.fillStyle = button.fillColor;
      ctx.fillRect(button.x, button.y, button.width, button.height);  // draw the button text
      ctx.fillStyle = button.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '25px arial';
      ctx.fillText(button.text, button.x + button.width / 2, button.y + this.button / 2, this.button);
    }
  }

  /**
   * Returns mouse pos relative to this node
   */
  getRelativeMousePos() {
    const [boundingX, boundingY] = this.getBounding();
    const [mouseX, mouseY] = app.canvas.canvas_mouse; 

    const relativeMouseX = mouseX - boundingX;
    const relativeMouseY = mouseY - boundingY;

    return [relativeMouseX, relativeMouseY];
  }

  /**
   * Checks current mouse position and returns
   * whether it is inside the bounding box of this node
   */
  isMouseWithinNode() {
    const boundingWidth = this.getBounding()[2];
    const boundingHeight = this.getBounding()[3];

    const [relativeMouseX, relativeMouseY] = this.getRelativeMousePos();

    if(
      relativeMouseX > 0 && 
      relativeMouseX < boundingWidth &&
      relativeMouseY > 0 &&
      relativeMouseY < boundingHeight
    ) {
      return true;
    } else {
      return false
    }
  }

  renderOnce(ctx) {
    this.addPet()
    ctx.canvas.addEventListener('click', ()=>{

      if(this.isMouseWithinNode()) {
        const [mouseX, mouseY] = this.getRelativeMousePos()
        for (let i = 0; i < this.buttons.length; i++) {
          const button = this.buttons[i];
          if(button.inBounds(mouseX, mouseY)) {
            button.onClick()
          }
        }
      }
    });

  }

  render(ctx) {

    this.renderBackground(ctx)
    this.renderButtons(ctx)
    this.renderFoods(ctx)
    this.renderPets(ctx) // render pet onto canvas
  }
}

