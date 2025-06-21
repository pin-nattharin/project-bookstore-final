document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lifestyle-books');

  const lifestyleBooks = [
    {
      id: 201,
      name: "The Yoga Lifestyle",
      price: 250,
      image: "images/lifestyle1.jpg"
    },
    {
      id: 202,
      name: "BUPA Guide to Healthy Living 101",
      price: 220,
      image: "images/lifestyle2.jpg"
    },
    {
      id: 203,
      name: "My Life Story",
      price: 199,
      image: "images/lifestyle3.jpg"
    }
  ];

  lifestyleBooks.forEach(book => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${book.image}" class="card-img-top" alt="${book.name}">
        <div class="card-body">
          <h5 class="card-title">${book.name}</h5>
          <p class="card-text text-danger">$${book.price}</p>
          <button class="btn btn-primary w-100 add-to-cart" data-id="${book.id}" data-name="${book.name}" data-price="${book.price}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  //document.addEventListener('click', (e) => {
    //if (e.target.classList.contains('add-to-cart')) {
      //const button = e.target;
      //const isLoggedIn = localStorage.getItem('login') === 'true';

      //if (!isLoggedIn) {
        //alert("Please login before adding to cart.");
        //return;
      //}

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
//});
