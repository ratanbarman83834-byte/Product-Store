const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    rating: 4.5,
    image:
      "https://png.pngtree.com/png-vector/20250321/ourmid/pngtree-wireless-headphone-png-image_15830312.png",
  },
  {
    id: 2,
    name: "Oversized T-Shirt",
    category: "Clothing",
    price: 799,
    rating: 4.3,
    image:
      "https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-black-medium-oversize-t-shirt-product-shot-png-image_12785694.png",
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Shoes",
    price: 1999,
    rating: 4.6,
    image:
      "https://png.pngtree.com/png-clipart/20241110/original/pngtree-sports-shoes-design-art-png-image_16809367.png",
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    rating: 4.4,
    image:
      "https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-the-smartwatch-banner-png-image_11919210.png",
  },
  {
    id: 5,
    name: "Leather Wallet",
    category: "Accessories",
    price: 999,
    rating: 4.2,
    image:
      "https://static.vecteezy.com/system/resources/previews/070/182/804/non_2x/durable-and-slim-men-s-wallet-free-png.png",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1599,
    rating: 4.5,
    image:
      "https://png.pngtree.com/png-vector/20250523/ourmid/pngtree-compact-black-bluetooth-speaker-on-white-surface-png-image_16357064.png",
  },
];

const productContainer = document.querySelector(".product-container");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const categorySelect = document.querySelector("#categorySelect");
const priceSlider = document.querySelector("#priceSlider");
const sortSelect = document.querySelector("#sortSelect");
const productsCount = document.querySelector("#productsCount");
const moreBtn = document.querySelector("#moreBtn");
const cartBtn = document.querySelector("#cartBtn");
const navBar = document.querySelector(".nav-bar ul");
const cartContainer = document.querySelector(".cart-items");
const cartSection = document.querySelector(".cart-section");
const backBtn = document.querySelector(".back-btn");
const subtotalAmount = document.querySelector(".subtotal-box span");
const totalItems = document.querySelector(".item-box span");
const totalAmount = document.querySelector(".total-box span");
const categorySelectProducts = document.querySelectorAll(
  ".select-category-products button",
);

let currentSearch = "";
let currentCategory = "All Products";
let currentMaxPrice = 5000;
let currentSort = "Default";
const cart = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if(savedCart){
    const storedCart = JSON.parse(savedCart);

    cart.push(...storedCart);
  }
}

loadCart();

function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    productContainer.innerHTML += `
    <div class="product-card">
    <div class="product-img-box">
            <img
                src="${product.image}"
                alt="${product.name}"
            />
        </div>
        <p>${product.name}</p>
        <span class="rating">⭐ ${product.rating}</span>
        <span class="price">₹${product.price}</span>
        <button class="add-cart-btn" data-id="${product.id}">Add Cart</button>
    </div>
    `;
  });
  const addCartBtn = document.querySelectorAll(".add-cart-btn");
  addCartBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const product = products.find((item) => {
        return item.id === id;
      });
      const existingProduct = cart.find((item) => {
        return item.id === id;
      });

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        const cartProduct = {
          ...product,
          quantity: 1,
        };
        cart.push(cartProduct);
      }
      saveCart();
      renderCart();
    });
  });
  productsCount.textContent = `${products.length} ${
    products.length === 1 ? "Product" : "Products"
  } Found`;
}

function searchProducts() {
  searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim() === "") {
      return;
    }
    currentSearch = searchInput.value.trim();
    applyFilters();
    searchInput.value = "";
  });
}

function categoryProducts() {
  categorySelectProducts.forEach((button) => {
    button.addEventListener("click", () => {
      categorySelectProducts.forEach((button) => {
        button.classList.remove("button-active");
      });
      button.classList.add("button-active");

      if (button.textContent === "All") {
        currentCategory = "All Products";
      } else {
        currentCategory = button.textContent;
      }
      applyFilters();
    });
  });
}

function categoryDropdown() {
  categorySelect.addEventListener("change", () => {
    currentCategory = categorySelect.value;
    categorySelectProducts.forEach((button) => {
      button.classList.remove("button-active");

      if (button.textContent === "All" && currentCategory === "All Products") {
        button.classList.add("button-active");
      }

      if (button.textContent === currentCategory) {
        button.classList.add("button-active");
      }
    });

    applyFilters();
  });
}

function priceFilter() {
  priceSlider.addEventListener("input", () => {
    currentMaxPrice = Number(priceSlider.value);
    applyFilters();
  });
}

function sortProducts() {
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    applyFilters();
  });
}

function applyFilters() {
  let filteredProducts = [...products];

  if (currentSearch !== "") {
    filteredProducts = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(currentSearch.toLowerCase());
    });
  }

  if (currentCategory !== "All Products") {
    filteredProducts = filteredProducts.filter((product) => {
      return currentCategory === product.category;
    });
  }

  filteredProducts = filteredProducts.filter((product) => {
    return product.price <= currentMaxPrice;
  });

  if (currentSort === "Price: Low to High") {
    filteredProducts.sort((a, b) => {
      return a.price - b.price;
    });
  }
  if (currentSort === "Price: High to Low") {
    filteredProducts.sort((a, b) => {
      return b.price - a.price;
    });
  }
  if (currentSort === "Name: A-Z") {
    filteredProducts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  renderProducts(filteredProducts);
}

function renderCart() {
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    cartContainer.innerHTML += `
    <div class="product-box">
                <div class="product-left">
                  <div class="product-img">
                    <img
                      src="${item.image}"
                      alt="${item.name}"
                    />
                  </div>
                </div>
                <div class="product-right">
                  <p>${item.name}</p>
                  <span>₹${item.price}</span>
                  <div class="quantity-delete-box">
                    <div class="quantity-box">
                      <p><span class="decrease-btn" data-id="${item.id}">-</span>
                       ${item.quantity} 
                       <span class="increase-btn" data-id="${item.id}">+</span></p>
                    </div>
                    <div class="delete-box">
                      <button class="delete-btn" data-id="${item.id}">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
    `;
  });

  const decreaseBtn = document.querySelectorAll(".decrease-btn");
  const increaseBtn = document.querySelectorAll(".increase-btn");
  const deleteBtn = document.querySelectorAll(".delete-btn");

  increaseBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      const item = cart.find((item) => {
        return id === item.id;
      });

      item.quantity++;

      renderCart();
      saveCart();
    });
  });

  decreaseBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      const item = cart.find((item) => {
        return id === item.id;
      });

      if (item.quantity > 1) {
        item.quantity--;
      }

      renderCart();
      saveCart();
    });
  });

  deleteBtn.forEach((button) => {
    button.addEventListener("click", ()=>{
      const id = Number(button.dataset.id);

      const itemIndex = cart.findIndex((item) => {
        return id === item.id;
      });

      cart.splice(itemIndex, 1);

      renderCart();
      saveCart();
    });
  });

  orderSummary();
}

function orderSummary(){
  let subTotal = 0;
  let items = 0;

  cart.forEach((item) => {
    subTotal += item.price*item.quantity;
    items += item.quantity;
  });

  subtotalAmount.textContent = `₹${subTotal}`;
  totalItems.textContent = `${items}`;
  totalAmount.textContent = `₹${subTotal}`;
}

moreBtn.addEventListener("click", () => {
  navBar.classList.toggle("active");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

cartBtn.addEventListener("click", () => {
  cartSection.style.display = "flex";
});

backBtn.addEventListener("click", () => {
  cartSection.style.display = "none";
});

renderProducts(products);
searchProducts();
categoryProducts();
categoryDropdown();
priceFilter();
sortProducts();
renderCart();
