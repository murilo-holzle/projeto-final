const products = [
  {
    id: 1,
    name: "Bowl Verde Claro",
    description: "Borda orgânica e acabamento fosco.",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Prato Natural",
    description: "Cerâmica artesanal para mesa posta.",
    price: 74.90,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Caneca Mineral",
    description: "Textura suave em tom terroso.",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Vaso Minimalista",
    description: "Peça decorativa feita à mão.",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80"
  }
];

let cart = [];

const productsRow = document.getElementById("productsRow");
const cartSheet = document.getElementById("cartSheet");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const pixPanel = document.getElementById("pixPanel");
const pixCode = document.getElementById("pixCode");
const copyMsg = document.getElementById("copyMsg");

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderProducts() {
  productsRow.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <strong>${money(product.price)}</strong>
          <button onclick="addToCart(${product.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function changeQty(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCart();
  }
}

function totalCart() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCart() {
  const qty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = totalCart();

  cartCount.textContent = qty;
  cartTotal.textContent = money(total);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
    pixPanel.classList.remove("active");
    generatePixCode(0);
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <small>${money(item.price)} · qtd. ${item.qty}</small>
        <div class="qty-actions">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
    </div>
  `).join("");

  generatePixCode(total);
}

function toggleCart() {
  cartSheet.classList.toggle("active");
}

function showPix() {
  if (cart.length === 0) {
    alert("Adicione um produto ao carrinho primeiro.");
    return;
  }

  generatePixCode(totalCart());
  pixPanel.classList.add("active");
  cartSheet.classList.add("active");
}

function generatePixCode(total) {
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
    copyMsg.classList.add("active");
    setTimeout(() => copyMsg.classList.remove("active"), 2200);
  });
}

function scrollProducts(direction) {
  productsRow.scrollBy({ left: direction * 230, behavior: "smooth" });
}

renderProducts();
updateCart();
