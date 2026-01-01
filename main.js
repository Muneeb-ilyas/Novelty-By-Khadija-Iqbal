// --- NAVBAR & MOBILE MENU LOGIC ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// --- SEARCH FUNCTIONALITY ---
function openSearch() {
    document.getElementById('search-overlay').classList.add('active');
    setTimeout(() => document.getElementById('search-input').focus(), 100);
}

function closeSearch() {
    document.getElementById('search-overlay').classList.remove('active');
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('search-input').value.toLowerCase();
        closeSearch();
        
        if (query.includes('menu') || query.includes('cake') || query.includes('brownie') || query.includes('chocolate')) {
            window.location.href = "menu.html";
        } else if (query.includes('contact') || query.includes('order') || query.includes('custom')) {
            window.location.href = "contact.html";
        } else if (query.includes('workshop')) {
            window.location.href = "workshops.html";
        } else if (query.includes('about') || query.includes('story')) {
            window.location.href = "about.html";
        } else {
            alert("No exact match found. Redirecting to Menu...");
            window.location.href = "menu.html";
        }
    }
}

// --- CART COUNT UPDATE ---
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('noveltyCart')) || [];
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
        // Calculate total quantity of items instead of just number of rows
        let totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// --- INITIALIZATION (Runs when page loads) ---
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount(); 
    
    // Sticky Navbar
    window.addEventListener("scroll", function() {
        var navbar = document.querySelector(".navbar");
        if(navbar) {
            // Uncomment next line if you want sticky nav back later
            // navbar.classList.toggle("sticky", window.scrollY > 50);
        }
    });

    // Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });
    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    // Slideshow (Index & About Pages)
    const slides = document.querySelectorAll('.intro-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2500);
    }

    // --- ADD TO CART LOGIC (UPDATED WITH QUANTITY) ---
    const cartButtons = document.querySelectorAll('.compact-btn');
    if (cartButtons.length > 0) {
        cartButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); 
                const card = this.closest('.compact-card');
                const name = card.querySelector('h3').innerText;
                
                // Step 1: Ask for Quantity
                let qtyInput = prompt(`How many "${name}" would you like to add?`, "1");
                
                // Validate Input (Must be a number and greater than 0)
                let quantity = parseInt(qtyInput);
                if (!quantity || quantity < 1) {
                    return; // Do nothing if cancelled or invalid
                }

                // Get other details
                const img = card.querySelector('img').src;
                const priceText = card.querySelector('.compact-price').innerText;
                const price = priceText.replace(/[^0-9]/g, '');
                const size = "Standard";

                // Step 2: Create Product Object with Quantity
                const product = { name, image: img, size, price, quantity: quantity };
                
                let cart = JSON.parse(localStorage.getItem('noveltyCart')) || [];
                cart.push(product);
                localStorage.setItem('noveltyCart', JSON.stringify(cart));
                
                updateCartCount(); 
                alert(`${quantity}x ${name} added to cart!`);
            });
        });
    }

    // Load Cart Logic (For Cart Page)
    if(window.location.pathname.includes("cart.html")) {
        loadCart();
    }
});

// --- MENU TABS ---
function openCategory(categoryName) {
    var contents = document.getElementsByClassName("category-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }
    var buttons = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(categoryName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// --- CART PAGE FUNCTIONS (UPDATED FOR TOTAL CALCULATION) ---
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('noveltyCart')) || [];
    let tableBody = document.getElementById('cart-items');
    let cartContent = document.getElementById('cart-content');
    let emptyMsg = document.getElementById('empty-msg');
    let total = 0;

    if (!tableBody || !cartContent || !emptyMsg) return;

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    cartContent.style.display = 'block';
    emptyMsg.style.display = 'none';
    tableBody.innerHTML = '';
    
    cart.forEach((item, index) => {
        // Calculate item total (Price * Quantity)
        let unitPrice = parseInt(item.price);
        let itemQty = parseInt(item.quantity) || 1; // Default to 1 if missing
        let itemTotal = unitPrice * itemQty;
        
        total += itemTotal;

        let row = `
            <tr>
                <td data-label="Product" style="display:flex; align-items:center; gap:15px;">
                    <img src="${item.image}" class="cart-product-img">
                    <div>
                        <div class="item-name">${item.name} <span style="font-size:0.8rem; color:var(--gold)">(x${itemQty})</span></div>
                        <div class="item-detail">Unit Price: Rs ${unitPrice}</div>
                    </div>
                </td>
                <td data-label="Price">Rs ${itemTotal}</td>
                <td data-label="Action">
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById('subtotal').innerText = 'Rs ' + total;
    document.getElementById('total-price').innerText = 'Rs ' + total;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('noveltyCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('noveltyCart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function checkoutWhatsApp() {
    let cart = JSON.parse(localStorage.getItem('noveltyCart')) || [];
    if (cart.length === 0) return;

    let message = "Hi, I would like to place an order:%0A%0A";
    let total = 0;

    cart.forEach(item => {
        let itemQty = parseInt(item.quantity) || 1;
        let itemTotal = parseInt(item.price) * itemQty;
        total += itemTotal;
        
        // WhatsApp Message Format: 2x Brownie (Rs 1000)
        message += `*${itemQty}x ${item.name}* - Rs ${itemTotal}%0A`;
    });

    message += `%0A*Total Bill: Rs ${total}*`;
    message += `%0A%0APlease confirm my order.`;
    
    window.open(`https://wa.me/923216222247?text=${message}`, '_blank');
}
// --- REVIEWS PAGE LOGIC ---
function submitReview(event) {
    event.preventDefault(); // Page refresh hone se rokta hai

    // Input values lena
    const name = document.getElementById('reviewerName').value;
    const ratingVal = document.getElementById('reviewerRating').value;
    const message = document.getElementById('reviewerMessage').value;

    // Stars generate karna
    let stars = "";
    for(let i=0; i<ratingVal; i++) { stars += "★"; }

    // Naya Card banana
    const newCard = `
        <div class="review-card" style="animation: fadeIn 0.5s ease;">
            <div class="stars">${stars}</div>
            <p>"${message}"</p>
            <h5>- ${name}</h5>
        </div>
    `;

    // Grid ke shuru mein add karna
    const container = document.getElementById('reviews-container');
    container.insertAdjacentHTML('afterbegin', newCard);

    // Form clear karna aur message dikhana
    document.getElementById('feedbackForm').reset();
    alert("Thank you, " + name + "! Your review has been added.");
}