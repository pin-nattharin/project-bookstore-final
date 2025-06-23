document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('romance-books');

  const romanceBooks = [
    {
      id: 101,
      name: "Pride and Prejudice",
      price: 299,
      image: "images/romance1.jpg"
    },
    {
      id: 102,
      name: "Me Before You",
      price: 259,
      image: "images/romance2.jpg"
    },
    {
      id: 103,
      name: "The Notebook",
      price: 279,
      image: "images/romance3.jpg"
    }
  ];

  // แสดงหนังสือ
    romanceBooks.forEach(book => {
    const col = document.createElement('div');
    col.className = 'col';

      col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${book.image}" class="card-img-top" alt="${book.name}">
        <div class="card-body">
          <h5 class="card-title">${book.name}</h5>
          <p class="card-text text-danger">$${book.price}</p>
          <button class="btn btn-primary w-100 add-to-cart" 
          data-id="${book.id}" 
          data-name="${book.name}" 
          data-price="${book.price}">
          Add to Cart </button>
        </div>
      </div>
      `;
        
  
    container.appendChild(col);
  });

  document.addEventListener('click', function (e) {
      const button = e.target.closest('.add-to-cart');
      if (!button) return;

      const isLoggedIn = localStorage.getItem('login');
      if (!isLoggedIn) {
        alert("Please login before adding to cart.");
        // เรียก modal login ได้ถ้ามี
        const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();
        return;
      }

      // ถ้า login แล้ว
      function addToCart(id, name, price) {
      fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ ส่ง session
        body: JSON.stringify({ productId: id, name, price })
      })
       .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          window.location.href = 'login.html'; // ✅ redirect ถ้ายังไม่ login
        } else {
          alert(data.message);
        }
      })
      .catch(() => alert("เกิดข้อผิดพลาด"));
    }
      
      // ✅ เพิ่มสินค้าเข้า cart (เก็บใน localStorage)
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      // ✅ แจ้งเตือน
      alert(`"${item.name}" added to cart.`);
    }
  );
      const item = {
        name: button.dataset.name,
        price: parseFloat(button.dataset.price)
      };

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${item.name} added to cart.`);
    }
  );