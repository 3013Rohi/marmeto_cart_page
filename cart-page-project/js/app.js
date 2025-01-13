const quantityInput = document.querySelector(".quantity-input");
const subtotalElement = document.querySelector(".subtotal");

quantityInput.addEventListener("input", () => {
  const price = 250000; // Price of the product
  const quantity = parseInt(quantityInput.value) || 1;
  const subtotal = price * quantity;
  subtotalElement.textContent = `Rs. ${subtotal.toLocaleString()}.00`;
});
// Update the subtotal and total when the quantity changes

quantityInput.addEventListener("input", (event) => {
  const price = 250000; // Hardcoded for this example
  const quantity = parseInt(event.target.value) || 1;
  const subtotal = price * quantity;

  subtotalElement.textContent = `Rs. ${subtotal.toLocaleString()}.00`;
  totalElement.textContent = `Rs. ${subtotal.toLocaleString()}.00`;
});
