// shop items
const APPLE = {
  id: '1',
  name: 'Apple',
  price: 50,
  description: 'This is an apple',
}
const ORANGE = {
  id: '2',
  name: 'Orange',
  price: 50,
  description: 'This is an orange',
}

export const items = {
  1: APPLE,
  2: ORANGE,
}

export const getItemById = (id) => {
  return items[id]
}
