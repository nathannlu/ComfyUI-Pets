import { items, getItemById } from './items.js'
import { user } from '../user/index.js'

export const container = document.createElement('div')
container.innerHTML = `
<div style="width: 500px">
  <h1>
    SHOP
  </h1>

  <div style="display: flex; gap: 24px;">
    ${generateShopHTML()}
  </div>
</div>
`

// Function to generate HTML for shop items
function generateShopHTML() {
  let html = ''

  Object.values(items).forEach((item) => {
    html += `
      <div class="shop-item">
        <h3>${item.name}</h3>
        <p>Price: $${item.price}</p>
        <button onclick="comfyPetsShopBuyItem(${item.id})">Buy</button>
      </div>
    `
  })

  return html
}

window.comfyPetsShopBuyItem = async (id) => {
  const item = getItemById(id)
  // check if user has enough funds
  if (user.balance < item.price) {
    // @todo display popup
    console.error(
      'Not enough funds. You are missing',
      item.price - user.balance,
    )
    return
  }

  // Charge user
  await user.chargeBalance(item.price)

  // persist newly bought item into user's inventory
  await user.addItemToInventory(item)
}
