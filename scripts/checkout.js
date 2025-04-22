let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartData = sessionStorage.getItem('checkoutCart');
    if (cartData) {
        cart = JSON.parse(cartData);
        displayOrderSummary();
    } else {
        window.location.href = 'order.html';
    }
});

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function displayOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    let total = 0;
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(subtotal)}</td>
        `;
        
        orderItems.appendChild(row);
    });
    
    orderTotal.textContent = formatPrice(total);
}

function processPayment(event) {
    event.preventDefault();
    
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    alert(`Thank you for your purchase! Your order will be delivered on ${formattedDate}.`);
    
    sessionStorage.removeItem('checkoutCart');
    window.location.href = 'index.html';
}