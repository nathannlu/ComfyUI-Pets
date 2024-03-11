import { ComfyNode } from '../comfy/comfy.js';
import { gameDialog } from '../comfy/ui.js';
import { getRandomNumber } from '../utils.js';
import { Pet } from './pet.js';
import { Food } from './food.js';
import { Game } from './endless_runner/index.js';
import { addFoodEvent, startGameEvent } from '../apiClient.js';
import { MediumButton } from './buttons.js';


/**
 * Describes the main game environment 
 */
export class ComfyPetsStage extends ComfyNode {

  constructor() {
    super()

    this.title = "Comfy Pet",
    this.feedButton = this.addButton("Feed pet", {}, () => {
      this.addFood()
      addFoodEvent()
    })
    this.feedButton.x = 8
    this.feedButton.y = 8
    this.feedButton.fontSize = 14;
    this.feedButton.fontWeight = "bold";
    this.feedButton.fontFamily = "Courier New";

    // Game
    this.gameButton = this.addButton("Play", {}, () => {
      //const { canvas, endGame } = startGame()
      const game = new Game()

      gameDialog.close = () => game.endGame();
      gameDialog.show(game.canvas)
      startGameEvent()
    })
    this.gameButton.x = 8 + this.feedButton.width + 8
    this.gameButton.y = 8
    this.gameButton.backgroundColor = "#0d47a1"
    this.gameButton.fontSize = 14;
    this.gameButton.fontWeight = "bold";
    this.gameButton.fontFamily = "Courier New";


    // Stage objects
    this.pets = [];
    this.foods = [];

    // Assets
    this.backgroundImage = new Image();
    this.backgroundImage.src = "https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY="
  }

  addPet() {
    const height = this.size[1];
    const petWidth = 75;
    const petHeight = 60;

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

  /**
   * Add a button to the ComfyUI node
   */
  addButton(buttonText, options, callback) {
    //this.addWidget("button", buttonText, "image", callback)
    var b = new MediumButton(buttonText, '#eeaa00', '#fff')
    b.onClick = callback 
    this.buttons.push(b)

    return b;
  }

  renderPets(ctx) {
    const [width] = this.size


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

      // render emote
      if(pet.emote) {
        ctx.fillStyle = "blue";
        ctx.font = "10px Arial";
        ctx.fillText('❤️', pet.x + pet.width, pet.y);
      }

      // move the pet
      //pet._showHitBox(ctx)
      pet.move(ctx, this.renderCount)
    }
  }

  renderFoods(ctx) {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i]

      if(!food.isActive) {
        this.foods.splice(i, 1);
      }

      ctx.drawImage(
        food.image,
        food.x,
        food.y,
        food.width,
        food.height
      );
    }
  }

  renderBackground(ctx) {
    const [width, height] = this.size
    ctx.drawImage(this.backgroundImage, 0, 0, width, height);
  }

  renderOnce() {
    this.addPet()
  }

  render(ctx) {
    this.renderBackground(ctx)
    //this.renderButtons(ctx)
    this.renderFoods(ctx)
    this.renderPets(ctx) // render pet onto canvas
  }
}




