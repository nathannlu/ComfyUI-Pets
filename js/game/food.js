import { GameObject } from './core.js';


export class Food extends GameObject {
  constructor({x, y, width, height}) {
    super(x, y, width, height);

    this.image = new Image();
    this.image.src = "https://44.media.tumblr.com/65175cb8addf6d61d20856d12f97c963/tumblr_mrcf12B0fE1rfjowdo1_500.gif"
  }

  // Additional methods or properties specific to the player can be added here
}
