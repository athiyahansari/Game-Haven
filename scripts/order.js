let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = null;

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelector('.parts-container').innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function generateProductHTML(product) {
    return `
        <div class="part-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <div class="quantity-control">
                <button onclick="decrementQuantity(this)">-</button>
                <input type="number" value="0" min="0" onchange="updateQuantity(this)">
                <button onclick="incrementQuantity(this)">+</button>
            </div>
            <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, this)">Add to Cart</button>
        </div>
    `;
}

function generateProductSection(category, products) {
    return `
        <section class="parts-section">
            <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <div class="parts-grid">
                ${products.map(product => generateProductHTML(product)).join('')}
            </div>
        </section>
    `;
}

function initializePage() {
    const container = document.querySelector('.parts-container');
    if (container && products) {
        container.innerHTML = Object.entries(products)
            .map(([category, items]) => generateProductSection(category, items))
            .join('');
    }
    updateCart();
}


document.addEventListener('DOMContentLoaded', fetchProducts);

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(subtotal)}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        
        cartItems.appendChild(row);
    });
    
    cartTotal.textContent = formatPrice(total);
    saveCart();
}

function addToCart(id, name, price, buttonElement) {
    const quantityInput = buttonElement.parentElement.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value);
    
    if (quantity > 0) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
        
        quantityInput.value = 0;
        updateCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQuantity(input) {
    const value = parseInt(input.value);
    if (value < 0) {
        input.value = 0;
    }
}

function incrementQuantity(button) {
    const input = button.parentElement.querySelector('input');
    input.value = parseInt(input.value) + 1;
}

function decrementQuantity(button) {
    const input = button.parentElement.querySelector('input');
    const newValue = parseInt(input.value) - 1;
    input.value = newValue < 0 ? 0 : newValue;
}

function saveAsFavorite() {
    if (cart.length > 0) {
        localStorage.setItem('favoriteOrder', JSON.stringify(cart));
        alert('Order saved as favorite!');
    } else {
        alert('Cannot save an empty cart as favorite!');
    }
}

function applyFavorite() {
    const favoriteOrder = localStorage.getItem('favoriteOrder');
    if (favoriteOrder) {
        cart = JSON.parse(favoriteOrder);
        updateCart();
        alert('Favorite order applied!');
    } else {
        alert('No favorite order found!');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = '../checkout.html';
}
