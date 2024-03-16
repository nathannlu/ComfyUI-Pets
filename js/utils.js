export function darkenHexColor(hexColor, percent) {
  // Ensure the percent is between 0 and 100
  percent = Math.min(100, Math.max(0, percent))

  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16)
  let g = parseInt(hexColor.slice(3, 5), 16)
  let b = parseInt(hexColor.slice(5, 7), 16)

  // Calculate the darkness factor
  let darkness = 1 - percent / 100

  // Apply darkness to each RGB component
  r = Math.round(r * darkness)
  g = Math.round(g * darkness)
  b = Math.round(b * darkness)

  // Convert back to hex
  const darkHexColor = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`

  return darkHexColor
}

export function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min
}

export function generateId() {
  const timestamp = Date.now().toString(16) // Convert current timestamp to hexadecimal
  const randomPart = Math.floor(Math.random() * 1000000).toString(16) // Generate a random number and convert to hexadecimal

  // Concatenate timestamp and random part to create the game ID
  const gameId = timestamp + randomPart

  return gameId
}
