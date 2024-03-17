import {
  getCurrentUser,
  setUserNewBalance,
  setUserNewInventory,
} from '../../apiClient.js'

class User {
  constructor() {
    // Initialize default values
    this.inventory = {}
    this.balance = 0

    this._initializeUser()
  }

  // Private methods
  _validateInventoryItemObject(item) {
    if (!item || typeof item !== 'object') {
      throw new Error(
        'An inventory item must be type object. Got type:',
        typeof item,
      )
    }
    if (!('id' in item)) {
      throw new Error('Inventory object is missing either id or quantity keys')
    }
  }

  async _initializeUser() {
    const userData = await getCurrentUser()

    for (const key in userData) {
      this[key] = userData[key]
    }
  }

  // Balance
  async addBalance(amount) {
    this.balance += amount
    await setUserNewBalance(this.balance)
  }

  async chargeBalance(amount) {
    this.balance -= amount
    await setUserNewBalance(this.balance)
  }

  // Inventory
  async addItemToInventory(item, quantity = 1) {
    this._validateInventoryItemObject(item)

    if (item.id in this.inventory) {
      this.inventory[item.id].quantity += quantity
    } else {
      const invItem = {
        id: item.id,
        quantity: 1,
      }
      this.inventory[item.id] = invItem
    }

    await setUserNewInventory(this.inventory)
  }

  async removeItemFromInventory(itemId, quantity = 1) {
    if (typeof itemId !== 'string') {
      throw new Error('Item id must be string')
    }

    if (itemId in this.inventory) {
      let item = this.inventory[itemId]
      item.quantity -= quantity

      // Remove item if it has less than 0 in
      // quantity
      if (item.quantity <= 0) {
        delete this.inventory[itemId]
      }
    } else {
      console.error('User does not have item')
    }

    await setUserNewInventory(this.inventory)
  }
}

export const user = new User()
