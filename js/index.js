import { app } from "./app.js";
import { api } from "./api.js";
import { ComfyWidgets, LGraphNode } from "./widgets.js";
import { GIF } from './gif.js';


class ComfyPets extends LiteGraph.LGraphNode {

  constructor() {
    super()
    if (!this.properties) {
      this.properties = {};
    }

    this.title = "Comfy Pet",

    this.widgets_start_y = 10;
    //this.setSize(this.computeSize());

    this.serialize_widgets = true;
    this.isVirtualNode = true;

    this.x = 0;

    this.currentDirection="right"
    this.time = 0;
    this.directionDuration = 0;
    this.petGif = GIF();
    this.petGif.load("https://raw.githubusercontent.com/tonybaloney/vscode-pets/master/media/dog/akita_walk_8fps.gif")
    //this.petGif.src = "";

    this.backgroundImage = new Image();
    this.backgroundImage.src = "https://media.istockphoto.com/id/1333010525/vector/simple-flat-pixel-art-illustration-of-cartoon-outdoor-landscape-background-pixel-arcade.jpg?s=612x612&w=0&k=20&c=uTGqB9fhmjzaNd17EGRHYU04_70K7a3M8ilRoJjDwtY="
  }

  drawBackground(ctx) {
    const [width, height] = this.size
    // Custom drawing logic here
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, this.size[0], this.size[1]);

    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("My Custom Node", 10, 20);

    ctx.drawImage(this.backgroundImage, 0, 0, width, height);
  }


  drawPet(ctx) {
    const [width, height] = this.size
    const rect1 = { x: height, y: height - 50, width: 50, height: 50, color: "blue", speed: 2 };
    function drawRect(rect, x) {
      ctx.fillStyle = rect.color;
      ctx.fillRect(x, rect.y, rect.width, rect.height);
    }

    //drawRect(rect1, this.x)

    try {
      ctx.drawImage(this.petGif.image, this.x, height-50, 75, 50);
    } catch (e) {

    }
  }


  movePet(ctx) {
    const [width, height] = this.size

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

    if(this.currentDirection == "right") {
      this.x += 0.5;
    }
    if(this.currentDirection == "left") {
      this.x -= 0.5;
    }

    // handle movement
    if(this.x > width - 75) {
      this.currentDirection = "left"
    }
    if(this.x < 0) {
      this.currentDirection = "right"
    }
  }

  onDrawForeground(ctx) {

    this.drawBackground(ctx)
    this.movePet(ctx)
    this.drawPet(ctx) // render pet onto canvas

    // animation loop
    /*
    const draw = () => {
      this.setDirtyCanvas(true, true)
      requestAnimationFrame(draw)
    }
    draw(ctx)
    */
  }
}


/** @typedef {import('../../../web/types/comfy.js').ComfyExtension} ComfyExtension*/
/** @type {ComfyExtension} */
const ext = {
  name: "nathannlu.ComfyPets",

  init(app) {
    //console.log("init")
  },

  // Add in node that keeps track of workflow_name
  // and etc
  registerCustomNodes() {
    /** @type {LGraphNode}*/

    LiteGraph.registerNodeType(
      "ComfyPets",
      Object.assign(ComfyPets, {
        title_mode: LiteGraph.NORMAL_TITLE,
        title: "Comfy Pet",
        collapsable: false,
      }),
    );
    ComfyPets.category = "Pets";
  },

};


app.registerExtension(ext);

