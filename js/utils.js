export function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateId() {
  const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
  const randomPart = Math.floor(Math.random() * 1000000).toString(16); // Generate a random number and convert to hexadecimal

  // Concatenate timestamp and random part to create the game ID
  const gameId = timestamp + randomPart;

  return gameId;
}


