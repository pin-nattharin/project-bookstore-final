const BASE_URL = 'http://localhost:3000/api/books';

document.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {
  fetch(`${BASE_URL}/getall`)
    .then(res => res.json())
    .then(books => {
      const table = document.getElementById('productTable');
      table.innerHTML = '';
      books.forEach(p => {
        table.innerHTML += `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category || ''}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
              <button class="btn btn-sm btn-danger" onclick='deleteProduct(${p.id})'>Delete</button>
            </td>
          </tr>`;
      });
    });
}

function saveProduct() {
  const id = document.getElementById('productId').value;
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value.trim();

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/${id}` : BASE_URL;

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, category })
  })
    .then(res => res.json())
    .then(() => {
      clearForm();
      loadProducts();
    });
}

function editProduct(product) {
  document.getElementById('productId').value = product.id;
  document.getElementById('name').value = product.name;
  document.getElementById('price').value = product.price;
  document.getElementById('category').value = product.category;
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => loadProducts());
  }
}

function clearForm() {
  document.getElementById('productId').value = '';
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('category').value = '';
}
