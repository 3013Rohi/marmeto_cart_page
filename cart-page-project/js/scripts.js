// Select DOM elements
const cartItemsContainer = document.querySelector(".cart-items tbody");
const subtotalElement = document.querySelector(".totals-subtotal");
const totalElement = document.querySelector(".totals-total");
const checkoutButton = document.getElementById("checkout-btn");

let cartData = [];

// Initialize the cart from localStorage
const initializeCartFromStorage = () => {
  const storedCartData = localStorage.getItem("cartData");
  if (storedCartData) {
    cartData = JSON.parse(storedCartData).map((item) => ({
      ...item,
      line_price: item.price * item.quantity, // Recalculate line_price from price and quantity
    }));
  }
};

// Save the cart data to localStorage
const saveCartToStorage = () => {
  localStorage.setItem("cartData", JSON.stringify(cartData));
};

// Fetch cart data from the API
const fetchCartData = async () => {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    );
    const data = await response.json();
    cartData = data.items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price / 100, // Convert from paise to rupees
      quantity: item.quantity,
      image: item.image,
      line_price: (item.price / 100) * item.quantity, // Ensure line_price is correct
    }));
    saveCartToStorage();
    renderCart();
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

// Render cart items dynamically
const renderCart = () => {
  cartItemsContainer.innerHTML = "";

  if (cartData.length === 0) {
    cartItemsContainer.innerHTML =
      "<tr><td colspan='5'>Your cart is empty.</td></tr>";
    subtotalElement.textContent = "₹0.00";
    totalElement.textContent = "₹0.00";
    return;
  }

  let subtotal = 0;

  cartData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "cart-item";
    subtotal += item.line_price;

    row.innerHTML = `
      <td class="product-info">
          <img src="${item.image}" alt="${item.title}">
          <span>${item.title}</span>
      </td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>
          <input type="number" value="${
            item.quantity
          }" min="1" class="quantity-input" data-index="${index}">
      </td>
      <td class="subtotal">₹${item.line_price.toLocaleString()}</td>
      <td>
          <button class="delete-button" data-index="${index}">
              <i class="fas fa-trash"></i>
          </button>
      </td>
    `;

    cartItemsContainer.appendChild(row);
  });

  subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
  totalElement.textContent = `₹${subtotal.toLocaleString()}`;
};

// Handle quantity change
const handleQuantityChange = (index, newQuantity) => {
  if (newQuantity < 1) return;

  cartData[index].quantity = newQuantity;
  cartData[index].line_price = cartData[index].price * newQuantity;
  saveCartToStorage();
  renderCart();
};

// Handle item removal
const handleItemRemoval = (index) => {
  cartData.splice(index, 1);
  saveCartToStorage();
  renderCart();
};

// Add event listeners for quantity change and item removal
cartItemsContainer.addEventListener("input", (event) => {
  if (event.target.classList.contains("quantity-input")) {
    const index = parseInt(event.target.dataset.index, 10);
    const newQuantity = parseInt(event.target.value, 10);
    handleQuantityChange(index, newQuantity);
  }
});

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".delete-button")) {
    const index = parseInt(
      event.target.closest(".delete-button").dataset.index,
      10
    );
    handleItemRemoval(index);
  }
});

// Handle checkout
checkoutButton.addEventListener("click", () => {
  alert("Thank you for your purchase!");

  // Clear the cart data
  cartData = [];
  saveCartToStorage();

  // Re-render the cart to show it's empty
  renderCart();

  // Redirect to the cart page (reload the current page)
  location.reload();
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  initializeCartFromStorage();

  // Recalculate line_price for all items to ensure correct calculation
  cartData = cartData.map((item) => ({
    ...item,
    line_price: item.price * item.quantity,
  }));

  saveCartToStorage();

  if (cartData.length === 0) {
    await fetchCartData();
  } else {
    renderCart();
  }
});
