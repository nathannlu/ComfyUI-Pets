import { items, getItemById } from "./items.js";

export const container = document.createElement("div");
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
  let html = "";

  Object.values(items).forEach(item => {
    html += `
      <div class="shop-item">
        <h3>${item.name}</h3>
        <p>Price: $${item.price}</p>
        <button onclick="comfyPetsShopBuyItem(${item.id})">Buy</button>
      </div>
    `;
  });

  return html;
}

window.comfyPetsShopBuyItem = (id) => {
  // check if user has enough funds

  // persist newly bought item into user's inventory

  console.log("Bought", getItemById(id))
}
