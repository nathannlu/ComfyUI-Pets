import { app } from './comfy.js';
import { ComfyPetsStage } from '../game/stage.js';
import { getCurrentUser } from '../apiClient.js';

/** @typedef {import('../../../web/types/comfy.js').ComfyExtension} ComfyExtension*/
/** @type {ComfyExtension} */
const ext = {
  name: "nathannlu.ComfyPets",

  // ComfyUI extension init
  init() {
    addPing()
  },

  registerCustomNodes() {
    LiteGraph.registerNodeType(
      "ComfyPets",
      Object.assign(ComfyPetsStage, {
        title_mode: LiteGraph.NORMAL_TITLE,
        title: "Comfy Pet",
        collapsable: false,
      }),
    );
    ComfyPetsStage.category = "Pets";
  },
};

app.registerExtension(ext);

async function addPing() {
  const user = getCurrentUser();
  const userId = user?.user_id

  if(userId) {
    const menu = document.querySelector(".comfy-menu");
    const i = document.createElement('img');
    i.src = `https://comfy-pets.herokuapp.com/p?e=${userId}`
    menu.appendChild(i);
  }
}
