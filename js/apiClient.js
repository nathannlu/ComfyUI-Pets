import { prepareJSON } from './utils.js'

/**
 * Responsible for interacting with ComfyUI backend,
 * or cloud
 */
let cache = {}
export const ENDPOINT = 'https://comfy-pets-cadc142b6d8e.herokuapp.com'
//export const ENDPOINT = "http://localhost:3000";

const EVENTS = {
  ADD_FOOD: 'ADD_FOOD',
  START_GAME: 'START_GAME',
  OPEN_SHOP: 'OPEN_SHOP',
  START_RENDER: 'START_RENDER',
}

const fetchWithCache = async (url) => {
  if (url in cache) {
    return cache[url]
  } else {
    const data = await fetch(url).then((x) => x.json())
    cache[url] = data
    return data
  }
}

export const getCurrentUser = async () => {
  const url = '/comfy-pets/user'
  const { user } = await fetchWithCache(url)
  let parsedUserData = {
    ...user,
    ['balance']: parseFloat(user.balance),
    ['inventory']: JSON.parse(prepareJSON(user.inventory)),
  }
  return parsedUserData
}

export const setUserNewBalance = async (balance) => {
  try {
    const url = '/comfy-pets/balance'
    const data = {
      balance,
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convert the data to JSON format
    }
    await fetch(url, requestOptions).then((x) => x.json())
  } catch (e) {
    throw new Error('Something went wrong')
  }
}

export const setUserNewInventory = async (inventory) => {
  try {
    const url = '/comfy-pets/inventory' // Update the URL to the inventory endpoint
    const data = {
      inventory,
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convert the data to JSON format
    }
    await fetch(url, requestOptions).then((x) => x.json())
  } catch (e) {
    throw new Error('Something went wrong')
  }
}

export async function ping() {
  const user = await getCurrentUser()
  const userId = user?.user_id
  const url = `${ENDPOINT}/p?e=${userId}`

  await fetch(url)
}

export async function addFoodEvent() {
  const user = await getCurrentUser()
  const userId = user?.user_id
  const url = `${ENDPOINT}/e?t=${EVENTS.ADD_FOOD}&u=${userId}`

  await fetch(url)
}
export async function startGameEvent() {
  const user = await getCurrentUser()
  const userId = user?.user_id
  const url = `${ENDPOINT}/e?t=${EVENTS.START_GAME}&u=${userId}`

  await fetch(url)
}
export async function openShopEvent() {
  const user = await getCurrentUser()
  const userId = user?.user_id
  const url = `${ENDPOINT}/e?t=${EVENTS.OPEN_SHOP}&u=${userId}`

  await fetch(url)
}

export async function startRenderEvent() {
  const user = await getCurrentUser()
  const userId = user?.user_id
  const url = `${ENDPOINT}/e?t=${EVENTS.START_RENDER}&u=${userId}`

  await fetch(url)
}
