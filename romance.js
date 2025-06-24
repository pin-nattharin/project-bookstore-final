document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('romance-books');
  //console.log('login:', localStorage.getItem('login')); // debug


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
        window.location.href = 'login.html';
        return;
      }

      // ✅ ดึง user email (ใช้เป็น key)
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email;
    if (!userEmail) {
      alert("User data missing, please login again.");
      localStorage.removeItem('login');
      window.location.href = 'login.html';
      return;
    }

      
      // ✅ เพิ่มสินค้าเข้า cart (เก็บใน localStorage)
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      // ✅ แจ้งเตือน
      alert(`"${item.name}" added to cart.`);
    }
  );
      // สร้างข้อมูลสินค้า
      const item = {
        name: button.dataset.name,
        price: parseFloat(button.dataset.price)
      };

      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // ✅ ถ้ายังไม่มี cart ของ user นี้
    if (!carts[userEmail]) {
      carts[userEmail] = [];
    }

    // ✅ ถ้ามีสินค้านี้แล้ว → เพิ่ม quantity
    const existingItem = carts[userEmail].find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      carts[userEmail].push(item);
    }


      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${item.name} added to cart.`);
    }
  );