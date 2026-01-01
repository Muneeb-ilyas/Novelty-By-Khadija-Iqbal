// --- Custom Cake Builder Logic ---

// State to store current selections
let cakeOrder = {
    shape: 'Round',
    size: '1',
    sizeName: '1 Pound',
    flavor: 'Vanilla',
    filling: 'Cream',
    frosting: 'Buttercream',
    color: '#fcfbf8',
    toppings: [],
    occasion: 'General',
    message: '',
    specialNotes: '',
    basePrice: 1500,
    totalPrice: 1500
};

// Pricing Config
const prices = {
    sizes: { '1': 1500, '2': 2800, '3': 4000, '4': 5500 },
    filling: { 'Cream': 0, 'Ganache': 200, 'Fruit': 300, 'Lotus': 400 },
    frosting: { 'Buttercream': 0, 'Fresh Cream': 0, 'Fondant': 500 }
};

// --- Step Navigation ---
function nextStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-card').forEach(el => el.classList.remove('active'));
    // Show specific step
    document.getElementById('step' + stepNumber).classList.add('active');
    
    // Update Progress
    const progress = (stepNumber / 5) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentStepNum').innerText = stepNumber;

    // Scroll top
    window.scrollTo({ top: 100, behavior: 'smooth' });
}

function scrollToPreview() {
    document.querySelector('.builder-preview').scrollIntoView({ behavior: 'smooth' });
}

// --- Main Update Function ---
function updateCake() {
    // 1. Get Values
    
    // Shape
    const shapeEl = document.querySelector('input[name="shape"]:checked');
    if(shapeEl) cakeOrder.shape = shapeEl.value;

    // Size
    const sizeEl = document.getElementById('cakeSize');
    cakeOrder.size = sizeEl.value;
    cakeOrder.sizeName = sizeEl.options[sizeEl.selectedIndex].text.split('(')[0].trim();
    cakeOrder.basePrice = parseInt(sizeEl.options[sizeEl.selectedIndex].getAttribute('data-price'));

    // Flavor
    const flavorEl = document.querySelector('input[name="flavor"]:checked');
    if(flavorEl) cakeOrder.flavor = flavorEl.value;

    // Filling
    const fillingEl = document.getElementById('filling');
    cakeOrder.filling = fillingEl.value;

    // Frosting
    const frostingEl = document.querySelector('input[name="frosting"]:checked');
    if(frostingEl) cakeOrder.frosting = frostingEl.value;

    // Color
    const colorEl = document.querySelector('input[name="color"]:checked');
    if(colorEl) cakeOrder.color = colorEl.value;

    // Toppings (Multi-select)
    cakeOrder.toppings = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        cakeOrder.toppings.push(cb.value);
    });

    // Occasion
    cakeOrder.occasion = document.getElementById('occasion').value;

    // Message
    cakeOrder.message = document.getElementById('cakeMessage').value;
    cakeOrder.specialNotes = document.getElementById('specialNotes').value;

    // 2. Calculate Price
    let total = cakeOrder.basePrice;
    total += (prices.filling[cakeOrder.filling] || 0);
    total += (prices.frosting[cakeOrder.frosting] || 0);
    
    // Topping cost (simplified: 100 per topping)
    total += (cakeOrder.toppings.length * 100);

    cakeOrder.totalPrice = total;

    // 3. Update UI
    updatePreviewUI();
}

function updatePreviewUI() {
    // Update Text Summary
    document.getElementById('sumShape').innerText = cakeOrder.shape;
    document.getElementById('sumSize').innerText = cakeOrder.sizeName;
    document.getElementById('sumFlavor').innerText = cakeOrder.flavor;
    document.getElementById('sumFrosting').innerText = cakeOrder.frosting;
    document.getElementById('sumFilling').innerText = cakeOrder.filling;
    document.getElementById('sumToppings').innerText = cakeOrder.toppings.length > 0 ? cakeOrder.toppings.join(', ') : 'None';
    document.getElementById('totalPrice').innerText = 'Rs ' + cakeOrder.totalPrice;

    // Update Visual Cake
    const tier1 = document.querySelector('.tier-1');
    const tier2 = document.querySelector('.tier-2');
    const msgEl = document.getElementById('previewMsg');

    // Change Color
    tier1.style.backgroundColor = cakeOrder.color;
    tier2.style.backgroundColor = cakeOrder.color;

    // Shape
    if(cakeOrder.shape === 'Square') {
        tier1.style.borderRadius = '5px';
        tier2.style.borderRadius = '5px';
    } else {
        tier1.style.borderRadius = '10px 10px 5px 5px';
        tier2.style.borderRadius = '10px 10px 5px 5px';
    }

    // Tiers
    if(cakeOrder.size === '4') { // 2 Tier option
        tier2.style.display = 'flex';
    } else {
        tier2.style.display = 'none';
    }

    // Message
    msgEl.innerText = cakeOrder.message;
    // Adjust text color based on cake brightness (simple check)
    if(cakeOrder.color === '#3b231f') {
        msgEl.style.color = '#fff'; // White text on dark chocolate
    } else {
        msgEl.style.color = '#3b231f';
    }
}

// --- Order Function ---
function placeCustomOrder() {
    let msg = `*New Custom Cake Order* %0A%0A`;
    msg += `*Shape:* ${cakeOrder.shape}%0A`;
    msg += `*Size:* ${cakeOrder.sizeName}%0A`;
    msg += `*Flavor:* ${cakeOrder.flavor}%0A`;
    msg += `*Filling:* ${cakeOrder.filling}%0A`;
    msg += `*Frosting:* ${cakeOrder.frosting}%0A`;
    msg += `*Color Theme:* ${cakeOrder.color}%0A`;
    msg += `*Toppings:* ${cakeOrder.toppings.join(', ') || 'None'}%0A`;
    msg += `*Occasion:* ${cakeOrder.occasion}%0A`;
    
    if(cakeOrder.message) msg += `*Message on Cake:* "${cakeOrder.message}"%0A`;
    if(cakeOrder.specialNotes) msg += `*Special Notes:* ${cakeOrder.specialNotes}%0A`;
    
    msg += `%0A*Estimated Price:* Rs ${cakeOrder.totalPrice}`;
    msg += `%0A%0APlease confirm availability.`;

    window.open(`https://wa.me/923216222247?text=${msg}`, '_blank');
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", function() {
    updateCake(); // Set defaults
});