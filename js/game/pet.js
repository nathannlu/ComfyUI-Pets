//import { GIF } from "../libs/gif.js";
import { GameObject } from "./core.js";

// Our sprite sheet is on a grid of 64pxs
// Each row is 64px tall, and each frame is 64px wide
const SPRITE_SIZE = 64;
const SPRITE_SHEET = {
  JUMP: {
    row: 0,
    frames: 11,
  },
  IDLE1: {
    row: 1,
    frames: 5,
  },
  IDLE2: {
    row: 2,
    frames: 5,
  },
  SIT: {
    row: 3,
    frames: 9,
  },
  WALK: {
    row: 4,
    frames: 5,
  },
  RUN: {
    row: 5,
    frames: 8,
  },
  SNIFF: {
    row: 6,
    frames: 8,
  },
  SNIFF_WALK: {
    row: 7,
    frames: 8,
  },
};

/**
 * Base pet class
 */
export class Pet extends GameObject {
  constructor({ x, y, height, width }) {
    super(x, y, height, width);
    // Pet state
    this.x = 0;
    this.height = height;
    this.width = width;
    this.currentDirection = "right";

    this.emote = false;

    // Properties here tell when the
    // pet to change directions. Right now
    // the pet will randomly change directions
    // after t seconds.
    this.time = 0;
    this.directionDuration = 0;

    // Assets
    //this.gifSrc = "https://raw.githubusercontent.com/tonybaloney/vscode-pets/master/media/dog/akita_walk_8fps.gif"
    //this.gifSrc = "./Group.png"
    this.gifSrc = "";
    this.petImage = new Image();
    //this.petImage.src = "./Group.png"
    this.petImage.src =
      "https://comfyui-output.nyc3.cdn.digitaloceanspaces.com/Group%204.png";

    //this.petGif = GIF();
    //this.petGif.load(this.gifSrc);

    /**
     * Creates render sprite functions
     * - e.g. renderWalk, renderSniff_walk, renderIdle1
     */
    Object.keys(SPRITE_SHEET).forEach((animName) => {
      // transform name to title case
      // FUNC1 -> Func1
      const titleCase =
        animName.charAt(0).toUpperCase() + animName.slice(1).toLowerCase();
      const funcName = `render${titleCase}`;

      const spriteFrames = SPRITE_SHEET[animName].frames;
      const spriteFramesY = SPRITE_SHEET[animName].row;
      this[funcName] = (ctx, renderCount, slowFpsBy = 10) => {
        this.renderSprite(
          ctx,
          renderCount,
          spriteFrames - 1,
          spriteFramesY,
          slowFpsBy
        );
      };
    });
  }

  _chooseRandomDirection() {
    const directions = ["left", "right", "idle1", "idle2"];

    const changeDirections = () => {
      const randomIndex = Math.floor(Math.random() * directions.length);
      this.currentDirection = directions[randomIndex];
    };

    if (Date.now() - this.time > this.directionDuration) {
      changeDirections();
      this.time = Date.now();
      this.directionDuration = Math.random() * 4000 + 1000;
    }
  }

  // debug function
  _showHitBox(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.x, // x
      this.y,
      this.width,
      this.height
    );
  }

  setEmote() {
    // set an emote for t seconds
    this.emote = true;

    setTimeout(() => {
      this.emote = false;
    }, 1000);
  }

  onClick() {
    this.setEmote();
  }

  move(ctx, renderCount) {
    switch (this.currentDirection) {
      case "right":
        this.x += 0.5;
        this.renderWalk(ctx, renderCount);
        break;

      case "left":
        this.x -= 0.5;
        this.renderWalk(ctx, renderCount);
        break;

      case "sniff_walk":
        this.renderSniff_walk(ctx, renderCount);
        break;

      case "idle1":
        this.renderIdle1(ctx, renderCount);
        break;

      case "idle2":
        this.renderIdle2(ctx, renderCount);
        break;

      default:
        this.renderIdle2(ctx, renderCount);
    }
  }

  chooseDirection(foods) {
    const doesFoodExist = foods.length > 0;

    if (doesFoodExist) {
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
      if (petPosition < nearestFood.x) {
        // pet is on the left of the nearest food,
        // so we move right
        this.currentDirection = "right";
      } else {
        // pet is on the right of the nearest food
        this.currentDirection = "left";
      }

      // see if objects interact
      if (this.isTouching(nearestFood)) {
        // Eat food
        nearestFood.delete();
        this.setEmote();
      }
    } else {
      this._chooseRandomDirection();
    }
  }

  renderSprite(
    ctx,
    renderCount,
    spriteFrames,
    spriteFramesY,
    slowFpsBy = 10 // Slows down fps by n amount
  ) {
    const _spriteFramesY = SPRITE_SIZE * spriteFramesY;
    const spriteRenderSize = SPRITE_SIZE * 2; // This is the final size users see the sprite as
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // There is 5 frames in the sprite sheet for walking
    // so instead of doing this.renderCount % 4 (0 - 5 frames),
    // we do 0 - 50 frames and scale down for a lower image fps.
    var _frame = renderCount % (spriteFrames * slowFpsBy);
    var frame = Math.round(_frame / slowFpsBy);

    const currentRenderFrame = SPRITE_SIZE * frame;

    // Offset
    const offsetX = (spriteRenderSize - this.width) / 2;
    const offsetY = (spriteRenderSize - this.height) / 2;

    if (this.currentDirection == "left") {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.petImage,
        currentRenderFrame,
        _spriteFramesY,
        SPRITE_SIZE,
        SPRITE_SIZE,
        -this.x - spriteRenderSize + offsetX,
        this.y - offsetY,
        spriteRenderSize,
        spriteRenderSize
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        this.petImage,
        currentRenderFrame,
        _spriteFramesY,
        SPRITE_SIZE,
        SPRITE_SIZE,
        this.x - offsetX,
        this.y - offsetY,
        spriteRenderSize,
        spriteRenderSize
      );
    }
  }
}
