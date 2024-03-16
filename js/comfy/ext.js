import { api, app } from './comfy.js'
import { ComfyPetsStage } from '../game/stage.js'
import { ping, getCurrentUser, setUserNewBalance } from '../apiClient.js'

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
          const user = await getCurrentUser()
          if (!user) {
            throw new Error('Invalid user id')
          }

          // Add balance to pet
          await setUserNewBalance(user.balance + 10)
        } catch (e) {
          console.error(e)
        }
      },
    )
  },
}

app.registerExtension(ext)
