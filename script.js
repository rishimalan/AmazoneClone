// 1. Mock Product Data (6 diverse products)
const products = [
  {
    id: 1,
    title: "ASUS ZenBook Pro Duo 15 OLED Laptop - Intel Core i9, 32GB RAM, 1TB SSD, GeForce RTX 3060",
    price: 199999.00,
    rating: 4.7,
    reviews: 1248,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "Premium Waterproof Hiking Backpack - 50L High Capacity for Camping, Trekking & Outdoor",
    price: 3499.00,
    rating: 4.3,
    reviews: 642,
    category: "home",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    badge: "Top Deal"
  },
  {
    id: 3,
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones (Hardcover)",
    price: 499.00,
    rating: 4.8,
    reviews: 87340,
    category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    badge: "Best Seller"
  },
  {
    id: 4,
    title: "Men's Classic White Sneakers - Premium Casual Leather Shoes",
    price: 2499.00,
    rating: 4.1,
    reviews: 310,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    badge: "10% Off"
  },
  {
    id: 5,
    title: "Minimalist Matte Black Ceramic Coffee Mug (450ml) - Double-Walled Insulation & Spill-Proof Lid",
    price: 799.00,
    rating: 4.5,
    reviews: 95,
    category: "home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
    badge: ""
  },
  {
    id: 6,
    title: "Ergonomic Wireless Mouse - Multi-Device Bluetooth Optical Mouse with Quiet Clicking",
    price: 1299.00,
    rating: 4.4,
    reviews: 1845,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    badge: "New Release"
  },
  {
    id: 7,
    title: "iPhone 15 Pro (128 GB) - Natural Titanium, Super Retina XDR Screen, A17 Pro Chip",
    price: 127990.00,
    rating: 4.8,
    reviews: 1820,
    category: "mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    badge: "Best Seller"
  },
  {
    id: 8,
    title: "Samsung Galaxy S24 Ultra 5G (256 GB) - Titanium Gray, 12GB RAM, 200MP Camera, S Pen Included",
    price: 129999.00,
    rating: 4.7,
    reviews: 945,
    category: "mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
    badge: "Hot Deal"
  }
];

// 2. Global State Variable
let cart = [];

// 3. Select DOM Elements
const productGrid = document.getElementById("productGrid");
const cartBadge = document.getElementById("cartBadge");
const cartSidebar = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const searchSelect = document.querySelector(".search-select");
const searchBtn = document.getElementById("searchBtn");
const resultsCount = document.getElementById("resultsCount");
const toastContainer = document.getElementById("toastContainer");
const checkoutBtn = document.getElementById("checkoutBtn");
const backToTopBtn = document.getElementById("backToTopBtn");
const logoLink = document.getElementById("logoLink");

// 4. Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  initHeroSlider();
  setupEventListeners();
});

// 5. Setup Event Listeners
function setupEventListeners() {
  // Search bar buttons
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Filter products when changing select category directly
  searchSelect.addEventListener("change", () => {
    const selectedCategory = searchSelect.value;
    const categoryLinks = document.querySelectorAll(".nav-category");
    categoryLinks.forEach(link => {
      if (link.getAttribute("data-category") === selectedCategory) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    performSearch();
  });

  // Logo click to reset filter
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchSelect.value = "all";
    document.querySelectorAll(".nav-category").forEach(item => item.classList.remove("active"));
    renderProducts(products);
  });

  // Category subnavbar clicks
  const categoryLinks = document.querySelectorAll(".nav-category");
  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Update active class
      categoryLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");

      const chosenCategory = link.getAttribute("data-category");
      
      // Synchronize search select dropdown
      searchSelect.value = chosenCategory;

      // Reset search text for clean category browse experience
      searchInput.value = "";

      if (chosenCategory === "all") {
        renderProducts(products);
      } else {
        const filtered = products.filter(p => p.category === chosenCategory);
        renderProducts(filtered);
      }

      // Scroll to products
      const productsSection = document.querySelector(".products-section");
      productsSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Scroll to Top action
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Checkout process Action
  checkoutBtn.addEventListener("click", processCheckout);
}

// 6. Dynamic Star Rating HTML Generator Helper
function generateStarsHTML(rating) {
  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalStars = 5;

  for (let i = 1; i <= fullStars; i++) {
    starsHTML += '<i class="fa-solid fa-star"></i>';
  }
  if (hasHalf) {
    starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
  }
  const emptyStars = totalStars - fullStars - (hasHalf ? 1 : 0);
  for (let i = 1; i <= emptyStars; i++) {
    starsHTML += '<i class="fa-regular fa-star"></i>';
  }
  return starsHTML;
}

// 7. Render Products Grid
function renderProducts(productsToRender) {
  productGrid.innerHTML = "";
  
  if (productsToRender.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--amazon-text-gray);">
        <i class="fa-solid fa-circle-info" style="font-size: 2.5rem; margin-bottom: 10px; color: #ccc;"></i>
        <h3>No products found matching your criteria.</h3>
        <p style="margin-top: 5px;">Try searching for a different keyword or category.</p>
      </div>
    `;
    resultsCount.textContent = "0 products found";
    return;
  }

  resultsCount.textContent = `Showing all ${productsToRender.length} products`;

  productsToRender.forEach(product => {
    // Format price into Indian Rupees (INR) format
    const priceString = product.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [wholePrice, decimalPrice] = priceString.split(".");

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title" title="${product.title}">${product.title}</h3>
        <div class="product-rating">
          <div class="stars">${generateStarsHTML(product.rating)}</div>
          <span class="rating-count">${product.reviews.toLocaleString("en-IN")}</span>
        </div>
        <div class="product-price-row">
          <span class="price-symbol">₹</span>
          <span class="price-whole">${wholePrice}</span>
          <span class="price-fraction">.${decimalPrice}</span>
        </div>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        <i class="fa-solid fa-cart-plus"></i> Add to Cart
      </button>
    `;
    productGrid.appendChild(card);
  });
}

// 8. Search & Category Filter Logic
function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedCategory = searchSelect.value;

  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesQuery = product.title.toLowerCase().includes(query) || 
                         product.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  renderProducts(filtered);

  // Smooth scroll down to products section if we searched from above
  if (window.scrollY < 200) {
    const productsSection = document.querySelector(".products-section");
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}

// 9. Toast Notification Handler
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span class="toast-message">${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Trigger animation after adding to DOM
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 10. Slide Cart Sidebar Toggle
function toggleCart() {
  cartSidebar.classList.toggle("open");
  cartBackdrop.classList.toggle("active");
  
  // Render cart items if opening cart
  if (cartSidebar.classList.contains("open")) {
    renderCartItems();
  }
}

// 11. Add Item to Cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Update Badge count
  updateCartBadge();

  // Trigger Badge bounce animation
  cartBadge.classList.add("badge-pop");
  setTimeout(() => {
    cartBadge.classList.remove("badge-pop");
  }, 200);

  // Visual success feedback
  showToast(`Added to Cart: ${product.title.substring(0, 30)}...`);

  // Update cart drawer dynamically if open
  if (cartSidebar.classList.contains("open")) {
    renderCartItems();
  }
}

// 12. Update Header Cart Badge
function updateCartBadge() {
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartBadge.textContent = totalCount;
}

// 13. Render Cart Item Cards and Calculate Subtotal
function renderCartItems() {
  cartItemsList.innerHTML = "";

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-cart-arrow-down"></i>
        <h4>Your Amazon Cart is empty</h4>
        <p>Add items to your cart to see them listed here.</p>
      </div>
    `;
    cartTotal.textContent = "₹0.00";
    return;
  }

  let totalValue = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    totalValue += itemSubtotal;

    const formattedItemSubtotal = itemSubtotal.toLocaleString("en-IN", { style: "currency", currency: "INR" });

    const cartItemRow = document.createElement("div");
    cartItemRow.className = "cart-item";
    cartItemRow.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price-row">
          <div class="cart-item-controls">
            <div class="quantity-adjuster">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
              <span class="quantity-val">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <span class="remove-item-btn" onclick="removeFromCart(${item.id})">Delete</span>
          </div>
          <span class="cart-item-price">${formattedItemSubtotal}</span>
        </div>
      </div>
    `;
    cartItemsList.appendChild(cartItemRow);
  });

  // Render Subtotal in the sidebar footer
  cartTotal.textContent = totalValue.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

// 14. Adjust Quantity inside Cart Panel
function updateQuantity(productId, change) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  const newQuantity = cart[itemIndex].quantity + change;

  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    cart[itemIndex].quantity = newQuantity;
    updateCartBadge();
    renderCartItems();
  }
}

// 15. Delete Single Product Type from Cart
function removeFromCart(productId) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  cart = cart.filter(item => item.id !== productId);
  
  updateCartBadge();
  renderCartItems();
  showToast(`Removed from Cart: ${item.title.substring(0, 30)}...`);
}

// 16. Checkout Process Simulation
function processCheckout() {
  if (cart.length === 0) {
    showToast("Please add items to your cart before checking out!");
    return;
  }

  const checkConfirm = confirm("Are you sure you want to proceed to checkout and place your order?");
  if (checkConfirm) {
    // Show loading simulator or success message
    const totalAmount = cartTotal.textContent;
    alert(`🎉 Order Placed Successfully!\n\nYour order has been recorded. Total paid: ${totalAmount}.\nThank you for shopping with Amazon Clone MVP!`);
    
    // Clear cart and close drawer
    cart = [];
    updateCartBadge();
    toggleCart();
    showToast("Checkout completed! Cart cleared.");
  }
}

// 17. Hero Slider functionality
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  const slides = document.querySelectorAll(".hero-slide");
  
  let currentSlide = 0;
  const slideCount = slides.length;
  let slideInterval;

  function showSlide(index) {
    if (index >= slideCount) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slideCount - 1;
    } else {
      currentSlide = index;
    }
    // Shift the slider container
    slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Button Listeners
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  // Auto Scroll slider interval
  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Start slider
  startInterval();
}