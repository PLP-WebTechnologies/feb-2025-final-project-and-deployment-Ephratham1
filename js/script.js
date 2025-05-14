
// Main JavaScript for Kasi-Empire Butchery Website

// Wait for DOM content to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Product Category Filter
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                categoryTabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get selected category
                const selectedCategory = this.getAttribute('data-category');
                
                // Filter products based on category
                productCards.forEach(card => {
                    if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    // Cart data structure
    let cart = [];
    
    // Load cart from localStorage if available
    if (localStorage.getItem('kasi-cart')) {
        try {
            cart = JSON.parse(localStorage.getItem('kasi-cart'));
            updateCartDisplay();
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            cart = [];
        }
    }
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get product information from the card
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.price') 
                    ? productCard.querySelector('.price').textContent.replace('R', '').replace('/kg', '') 
                    : productCard.querySelector('p').textContent.replace('R', '').replace('/kg', ''));
                
                // Check if product is already in cart
                const existingProduct = cart.find(item => item.name === productName);
                
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('kasi-cart', JSON.stringify(cart));
                
                // Update cart display
                updateCartDisplay();
                
                // Show a notification
                showNotification(`${productName} added to cart`);
            });
        });
    }
    
    // Function to update cart display
    function updateCartDisplay() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }
        
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        
        // Clear cart display
        cartItems.innerHTML = '';
        
        // Calculate total
        let total = 0;
        
        // Add each item to cart display
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">${item.quantity}</div>
                <div class="cart-item-remove">
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
        
        // Update total
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
    }
    
    // Function to remove item from cart
    function removeFromCart(index) {
        const removedItem = cart[index];
        
        // Remove item from cart
        cart.splice(index, 1);
        
        // Save updated cart to localStorage
        localStorage.setItem('kasi-cart', JSON.stringify(cart));
        
        // Update cart display
        updateCartDisplay();
        
        // Show notification
        if (removedItem) {
            showNotification(`${removedItem.name} removed from cart`);
        }
    }
    
    // Checkout button functionality
    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            showNotification('Proceeding to checkout...', 'success');
            // In a real implementation, this would redirect to a checkout page
            // For this demo, we'll just clear the cart after a delay
            setTimeout(() => {
                cart = [];
                localStorage.removeItem('kasi-cart');
                updateCartDisplay();
                showNotification('Thank you for your order!', 'success');
            }, 2000);
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, this would send the data to a server
            // For this demo, we'll just display a success message
            
            // Simulate sending message
            formMessage.textContent = `Thank you, ${name}! Your message has been sent. We'll get back to you soon.`;
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);
            
            // Add styles to notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '5px';
            notification.style.color = '#fff';
            notification.style.zIndex = '1000';
            notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }
        
        // Set background color based on notification type
        if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#2ecc71';
        } else {
            notification.style.backgroundColor = '#3498db';
        }
        
        // Set notification message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }
    
    // Handle animations on scroll
    const animatedElements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial check and add scroll event listener
    checkScroll();
    window.addEventListener('scroll', checkScroll);
});
