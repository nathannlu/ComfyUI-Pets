import { ComfyNode } from '../comfy/comfy.js'
import { gameDialog } from '../comfy/ui.js'
import { getRandomNumber } from '../utils.js'
import { Pet } from './pet.js'
import { Food } from './food.js'
import { container } from './shop/index.js'
import { EndlessRunnerGame } from './minigames/endless_runner.js'
import { FlappyGame } from './minigames/flappy_pets.js'
import { addFoodEvent, startGameEvent } from '../apiClient.js'
import { MediumButton } from './buttons.js'
import { events, EARN_COINS } from '../events.js'
import { PointBar } from './ui/pointBar.js'

import { user } from './user/index.js'

/**
 * Describes the main game environment
 */
export class ComfyPetsStage extends ComfyNode {
  constructor() {
    super()
    ;(this.title = 'Comfy Pet'),
      (this.feedButton = this.addButton('Feed pet', {}, () => {
        this.addFood()
        addFoodEvent()
      }))
    this.gutter = 8

    this.feedButton.x = this.gutter
    this.feedButton.y = this.gutter
    this.feedButton.fontSize = 14
    this.feedButton.fontWeight = 'bold'
    this.feedButton.fontFamily = 'Courier New'

    // event emitter
    this.events = events
    this.events.addEventListener(EARN_COINS, async (event) => {
      const coins = event.detail.coins
      this.setTextDisplay(`+${coins} coins`)

      // @hotfix - changes aren't propagating
      // to db in time.
      //await this.rerenderUser()

      this.user.addBalance(parseInt(coins))
    })
    this.textDisplay = null

    // Initialize User
    this.user = user
    //this.initializeUser()

    // Endless Runner Game
    this.gameButtonEndlessRunner = this.addButton('Play Hop Dog', {}, () => {
      //const { canvas, endGame } = startGame()
      const game = new EndlessRunnerGame()

      gameDialog.close = () => game.endGame()
      gameDialog.show(game.canvas)
      startGameEvent()
    })
    this.gameButtonEndlessRunner.x = this.gutter + this.feedButton.width + 8
    this.gameButtonEndlessRunner.y = this.gutter
    this.gameButtonEndlessRunner.backgroundColor = '#0d47a1'
    this.gameButtonEndlessRunner.fontSize = 14
    this.gameButtonEndlessRunner.fontWeight = 'bold'
    this.gameButtonEndlessRunner.fontFamily = 'Courier New'
    this.gameButtonEndlessRunner.width = 150

    // Flappy Game
    this.gameButtonFlappyGame = this.addButton('Play Flappy Dog', {}, () => {
      //const { canvas, endGame } = startGame()
      const game = new FlappyGame()

      gameDialog.close = () => game.endGame()
      gameDialog.show(game.canvas)
      startGameEvent()
    })
    this.gameButtonFlappyGame.x =
      this.gutter + this.feedButton.width + this.gutter
    this.gameButtonFlappyGame.y =
      this.gutter + this.gameButtonFlappyGame.height + this.gutter
    this.gameButtonFlappyGame.backgroundColor = '#0d47a1'
    this.gameButtonFlappyGame.fontSize = 14
    this.gameButtonFlappyGame.fontWeight = 'bold'
    this.gameButtonFlappyGame.fontFamily = 'Courier New'
    this.gameButtonFlappyGame.width = 150

    // Shop
    this.shopButton = this.addButton('Shop', {}, () => {
      gameDialog.show(container)
    })
    this.shopButton.x =
      8 + this.feedButton.width + this.gameButtonFlappyGame.width + 8 + 8
    this.shopButton.y = 8
    this.shopButton.backgroundColor = '#006400'
    this.shopButton.fontSize = 14
    this.shopButton.fontWeight = 'bold'
    this.shopButton.fontFamily = 'Courier New'

    this.size = [400, 200]

    // Stage objects
    this.pets = []
    this.foods = []
    this.gameObjectArrays.push(this.pets)

    // GUI Elements
    this.guiElements = []
    this.gameObjectArrays.push(this.guiElements)

    // Assets
    this.backgroundImage = new Image()
    this.backgroundImage.src =
      'https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/Summer2.png'
  }

  /*
  async initializeUser() {
    this.user = await getCurrentUser()
  }
  async rerenderUser() {
    await this.initializeUser()
  }
  */

  addPet() {
    const height = this.size[1]
    const petWidth = 75
    const petHeight = 60

    const pet = new Pet({
      x: 0,
      y: height - petHeight,
      width: petWidth,
      height: petHeight,
    })

    this.pets.push(pet)

    this.hungerPointsBar = this.addPointBar({
      x: this.feedButton.x + this.feedButton.width / 4,
      y: this.feedButton.y + this.feedButton.height + this.gutter,
      width: 50,
      height: 75,
      maxPoints: 10,
      label: 'Hunger',
      colour: '#aa00ee',
      associatedId: pet.id,
    })
    this.guiElements.push(this.hungerPointsBar)
  }

  addFood() {
    const [width, height] = this.size
    const foodWidth = 25
    const foodHeight = 25

    // choose a random inbetween the bounding box
    const foodPos = getRandomNumber(0, width - foodWidth)

    const food = new Food({
      x: foodPos,
      y: height - foodHeight,
      width: foodWidth,
      height: foodHeight,
    })

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

    return b
  }

  setTextDisplay(text) {
    // set an emote for t seconds
    this.textDisplay = text

    setTimeout(() => {
      this.textDisplay = null
    }, 1000)
  }

  renderUserCoins(ctx) {
    if (this.user) {
      const [width] = this.size

      const text = `${this.user.balance} coins`
      const fontSize = 16
      const fontFamily = 'Arial'
      ctx.font = `800 ${fontSize}px ${fontFamily}`

      ctx.fillStyle = '#FFBF00'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, width - 16, 16)

      // Stroke the text with white color outside
      /*
      ctx.strokeStyle = 'black';
      ctx.lineWidth = .5; // Adjust the thickness of the outline
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeText(text, width - 16, 16);
      */
    }
  }

  renderTextCenter(ctx) {
    if (this.textDisplay) {
      const [width, height] = this.size

      // Calculate the position to render the text in the center
      const x = width / 2
      const y = height / 2

      // Set font properties
      const fontSize = 20
      const fontFamily = 'Arial'
      ctx.font = `bold ${fontSize}px ${fontFamily}`

      // Text to render
      const text = this.textDisplay

      // Draw the text in the center
      ctx.fillStyle = '#FFBF00'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, x, y)
    }
  }

  addPointBar({
    x,
    y,
    width,
    height,
    maxPoints,
    label,
    colour,
    fontSize = 14,
    fontFamily = 'Courier New',
    fontWeight = 'bold',
    associatedId = null,
    initialPoints = maxPoints,
  }) {
    const pb = new PointBar({
      x: x,
      y: y,
      width: width,
      height: height,
      maxPoints: maxPoints,
      colour: colour,
      label: label,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      associatedId: associatedId,
      initialPoints: initialPoints,
    })
    this.guiElements.push(pb)

    return pb
  }

  renderGUIElements(ctx) {
    for (let i = 0; i < this.guiElements.length; i++) {
      const guiElement = this.guiElements[i]
      guiElement.render(ctx)
    }
  }

  updatePointBars(value, associatedId) {
    for (let i = 0; i < this.guiElements.length; i++) {
      const guiElement = this.guiElements[i]
      if (guiElement.associatedId == associatedId) {
        guiElement.setPoints(value)
      }
    }

    // clear inactive associated GUI elements
    // this.guiElements = this.guiElements.filter((el) => el.objectId !== associatedId);
  }

  renderPets(ctx) {
    const [width] = this.size

    for (let i = 0; i < this.pets.length; i++) {
      const pet = this.pets[i]

      // Delete inactive frames
      if (!pet.isActive) {
        this.pets.splice(i, 1)
      }

      // update hunger
      const hungerUpdateValue = pet.updateHunger()
      if (hungerUpdateValue !== null) {
        this.updatePointBars(hungerUpdateValue, pet.id)
        if (hungerUpdateValue === 0) {
          pet.isActive = false
        }
      }

      // choose directions
      pet.chooseDirection(this.foods)

      // choose directions - handle if pet walks off the map
      if (pet.x > width - 75) {
        pet.currentDirection = 'left'
      }
      if (pet.x < 0) {
        pet.currentDirection = 'right'
      }

      // render emote
      if (pet.emote) {
        ctx.fillStyle = 'blue'
        ctx.font = '10px Arial'
        ctx.fillText('❤️', pet.x + pet.width, pet.y)
      }

      // render emote
      if (pet.talk) {
        pet.renderTextBubble(ctx)
      }

      // move the pet
      //pet._showHitBox(ctx)
      pet.move(ctx, this.renderCount)
    }
  }

  renderFoods(ctx) {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i]

      if (!food.isActive) {
        this.foods.splice(i, 1)
      }

      ctx.drawImage(food.image, food.x, food.y, food.width, food.height)
    }
  }

  renderBackground(ctx) {
    const [width, height] = this.size
    ctx.drawImage(this.backgroundImage, 0, 0, width, height)
  }

  renderOnce() {
    this.addPet()
  }

  render(ctx) {
    this.renderBackground(ctx)
    this.renderUserCoins(ctx)
    this.renderTextCenter(ctx)
    //this.renderButtons(ctx)
    this.renderFoods(ctx)
    this.renderPets(ctx) // render pet onto canvas
    this.renderGUIElements(ctx)
  }
}
