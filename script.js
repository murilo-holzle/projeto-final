const products = [
  {
    id: 1,
    name: "Bowl Verde Claro",
    description: "Bowl artesanal com borda rústica.",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Prato Cerâmica Natural",
    description: "Prato raso com acabamento fosco.",
    price: 74.90,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Caneca Artesanal",
    description: "Caneca feita à mão em tom mineral.",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Vaso Minimalista",
    description: "Vaso decorativo para ambientes leves.",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80"
  }
];

let cart = [];

const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const pixBox = document.getElementById("pixBox");
const pixCode = document.getElementById("pixCode");
const copyFeedback = document.getElementById("copyFeedback");

function formatMoney(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderProducts() {
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong class="price">${formatMoney(product.price)}</strong>
        <button class="add-cart" onclick="addToCart(${product.id})">
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function changeQty(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCart();
  }
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  cartCount.textContent = quantity;
  cartTotal.textContent = formatMoney(total);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
    pixBox.classList.remove("active");
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">

      <div>
        <h4>${item.name}</h4>
        <small>${formatMoney(item.price)} cada</small>

        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <small>Total: ${formatMoney(item.price * item.quantity)}</small>
        <br>
        <button class="remove" onclick="removeFromCart(${item.id})">
          Remover
        </button>
      </div>
    </div>
  `).join("");

  generatePixCode(total);
}

function openCart() {
  cartDrawer.classList.add("active");
  overlay.classList.add("active");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  overlay.classList.remove("active");
}

function showPix() {
  if (cart.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  generatePixCode(getTotal());
  pixBox.classList.add("active");
}

function generatePixCode(total) {
  /*
    Código Pix demonstrativo.
    Para receber Pix real, gere o payload EMV válido com:
    - sua chave Pix;
    - nome do recebedor;
    - cidade;
    - TXID;
    - CRC16 correto.
  */

  const value = total.toFixed(2);

  const fakePayload =
    "000201" +
    "26580014BR.GOV.BCB.PIX" +
    "0136sua-chave-pix@exemplo.com.br" +
    "52040000" +
    "5303986" +
    "54" + value.length.toString().padStart(2, "0") + value +
    "5802BR" +
    "5916ESPACO CERAMICA" +
    "6008CURITIBA" +
    "62100506PEDIDO" +
    "6304ABCD";

  pixCode.value = fakePayload;
}

function copyPix() {
  navigator.clipboard.writeText(pixCode.value).then(() => {
    copyFeedback.classList.add("active");

    setTimeout(() => {
      copyFeedback.classList.remove("active");
    }, 2200);
  });

function mostrarInfo() {
  const info = document.getElementById("infoAcessibilidade");

  if (info.style.display === "none") {
    info.style.display = "block";
  } else {
    info.style.display = "none";
  }
}

}

renderProducts();
updateCart();
