// Enum - item categories
const Types = {
  FOOD: "FOOD",
  FURNITURE: "FURNITURE",
  BACKGROUND: "BACKGROUND",
}

// shop items
const APPLE = {
  id: '1',
  name: 'Apple',
  price: 100,
  type: Types.FOOD,
  data: {
    effects: {
      hunger: 2
    }
  },
  description: 'This is an apple',
}
const ORANGE = {
  id: '2',
  name: 'Orange',
  price: 175,
  data: {
    effects: {
      hunger: 4
    }
  },
  description: 'This is an orange',
}
const FILET_MIGNOM = {
  id: '3',
  name: 'Filet Mignom',
  price: 400,
  data: {
    effects: {
      hunger: 9
    }
  },
  description: 'Eating luxurious',
}

export const items = {
  '1': APPLE,
  '2': ORANGE,
  '3': FILET_MIGNOM,
}

export const getItemById = (id) => {
  return items[id]
}
