document.addEventListener("DOMContentLoaded", () => {
  // Navbar toggle
  const bar = document.getElementById("bar");
  const nav = document.getElementById("navebar");
  const cancle = document.getElementById("cancle");

  if (bar && nav) {
    bar.addEventListener("click", () => {
      nav.classList.add("active");
    });
  }

  if (cancle && nav) {
    cancle.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  }

  // Product click to redirect
  const proContainer = document.querySelector(".pro-container");

  if (proContainer) {
    proContainer.addEventListener("click", function (event) {
      let product = event.target.closest(".pro");
      if (!product) return;

      let imgSrc = product.querySelector(".pro-img img")?.src || "";
      let name = product.querySelector("h5")?.innerText || "Unknown";
      let price = product.querySelector("h4")?.innerText || "0";

      localStorage.setItem("productImage", imgSrc);
      localStorage.setItem("productName", name);
      localStorage.setItem("productPrice", price);

      window.location.href = "sproduct.html";
    });
  }

  // Cart logic
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (addToCartButtons.length > 0 && cartCount && cartItems) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name") || "Item";
        const price = parseInt(button.getAttribute("data-price")) || 0;

        cart.push({ name, price, quantity: 1 }); // quantity added for consistency with renderCart
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      });
    });

    function updateCartUI() {
      cartCount.textContent = cart.length;
      cartItems.innerHTML = "";

      cart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₹${item.price}`;
        cartItems.appendChild(li);
      });
    }
  }
});

// add to cart functionality for product details page
document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.querySelector("#cart tbody");

  if (!tbody) return;

  function renderCart() {
    tbody.innerHTML = "";

    cart.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><a href="#" class="remove-item" data-index="${index}"><i class="far fa-times-circle"></i></a></td>
        <td><img src="${
          item.image || ""
        }" alt="Product Image" width="60" /></td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td><input type="number" class="qty-input" data-index="${index}" value="${
        item.quantity
      }" min="1" /></td>
        <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
      `;

      tbody.appendChild(tr);
    });

    attachEvents();
  }

  function attachEvents() {
    // Quantity change
    const qtyInputs = document.querySelectorAll(".qty-input");
    qtyInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          cart[index].quantity = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      });
    });

    // Remove item
    const removeBtns = document.querySelectorAll(".remove-item");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
