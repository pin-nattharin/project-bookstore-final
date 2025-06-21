document.addEventListener('DOMContentLoaded', () => {
  const checkoutList = document.getElementById('checkout-list');
  const totalElement = document.getElementById('checkout-total');
  const payBtn = document.getElementById('pay-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    checkoutList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      checkoutList.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          Your cart is empty.
        </div>
      `;
      payBtn.disabled = true;
      totalElement.textContent = "0";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      itemDiv.innerHTML = `
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">$${item.price.toFixed(2)}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Remove</button>
      `;
      checkoutList.appendChild(itemDiv);
    });

    totalElement.textContent = total.toFixed(2);
    payBtn.disabled = false;
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  payBtn.addEventListener('click', () => {
    const total = totalElement.textContent;
    if (confirm(`Confirm payment of $${total}?`)) {
      alert('Payment successful! Thank you.');
      localStorage.removeItem('cart');
      location.reload(); // Clear cart and reload
    }
  });

  renderCart();
});
