import { app } from './comfy.js';
import { ComfyPetsStage } from '../game/stage.js';

/** @typedef {import('../../../web/types/comfy.js').ComfyExtension} ComfyExtension*/
/** @type {ComfyExtension} */
const ext = {
  name: "nathannlu.ComfyPets",

  // ComfyUI extension init
  init(app) {},

  registerCustomNodes() {
    LiteGraph.registerNodeType(
      "ComfyPets",
      Object.assign(ComfyPetsStage, {
        title_mode: LiteGraph.NORMAL_TITLE,
        title: "Comfy Pet",
        collapsable: false,
      }),
    );
    ComfyPets.category = "Pets";
  },
};

app.registerExtension(ext);
