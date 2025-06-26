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
  const imageInput = document.getElementById('image')?.files?.[0] || null;


  // สร้าง FormData เพื่อส่งไฟล์รูปและข้อมูลอื่น ๆ
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('category', category);

  // ถ้ามีไฟล์รูป เลือกไฟล์อัพโหลด
  if (imageInput) {
    formData.append('image', imageInput);
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/${id}` : BASE_URL;

  fetch(BASE_URL, {
    method,
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      clearForm();
      loadProducts();
    })
    .catch(err => console.error('Upload error:', err));
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
  document.getElementById('image').value = '';
}
