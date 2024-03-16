import { api, app } from './comfy.js'
import { ComfyPetsStage } from '../game/stage.js'
import { ping } from '../apiClient.js'
import { events, EARN_COINS } from '../events.js'

/** @typedef {import('../../../web/types/comfy.js').ComfyExtension} ComfyExtension*/
/** @type {ComfyExtension} */
const ext = {
  name: 'nathannlu.ComfyPets',

  // ComfyUI extension init
  init() {
    ping()
  },

  registerCustomNodes() {
    LiteGraph.registerNodeType(
      'ComfyPets',
      Object.assign(ComfyPetsStage, {
        title_mode: LiteGraph.NORMAL_TITLE,
        title: 'Comfy Pet',
        collapsable: false,
      }),
    )
    ComfyPetsStage.category = 'Pets'
  },

  async setup() {
    window.addEventListener('message', (event) => {
      if (!event.data.flow || Object.entries(event.data.flow).length <= 0)
        return
      //   updateBlendshapesPrompts(event.data.flow);
    })

    api.addEventListener('executed', async () =>
      //evt
      {
        // If we want to vary the rewards in the future
        //const elapsedTime = evt.timeStamp
        try {
          // Add balance to pet
          const e = new CustomEvent(EARN_COINS, { detail: { coins: 10 } })
          events.dispatchEvent(e)
        } catch (e) {
          console.error(e)
        }
      },
    )
  },
}

app.registerExtension(ext)
