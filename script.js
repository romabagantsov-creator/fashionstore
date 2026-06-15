// Товары
const products = [
    { id: 1, name: "Худи Oversized Black", category: "hoodies", price: 4990, icon: "🖤", inStock: true },
    { id: 2, name: "Худи с принтом", category: "hoodies", price: 5490, icon: "🔥", inStock: true },
    { id: 3, name: "Футболка лого", category: "t-shirts", price: 1990, icon: "👕", inStock: true },
    { id: 4, name: "Футболка оверсайз", category: "t-shirts", price: 2490, icon: "✨", inStock: true },
    { id: 5, name: "Карго штаны", category: "pants", price: 5990, icon: "👖", inStock: true },
    { id: 6, name: "Штаны классические", category: "pants", price: 4490, icon: "📿", inStock: true },
    { id: 7, name: "Шапка бини", category: "accessories", price: 1290, icon: "🧢", inStock: true },
    { id: 8, name: "Сумка шоппер", category: "accessories", price: 2490, icon: "🛍️", inStock: true }
];

let cart = JSON.parse(localStorage.getItem('fashion_cart')) || [];
let currentCategory = 'all';

// Сохранение корзины
function saveCart() {
    localStorage.setItem('fashion_cart', JSON.stringify(cart));
    updateCartUI();
}

// Обновление UI корзины
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartTotal) cartTotal.textContent = total.toLocaleString();
    renderCartItems();
}

// Рендер корзины
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Корзина пуста</p>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>${item.icon} ${item.name}<br><small>${item.price.toLocaleString()} ₽</small></div>
            <div>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span style="margin:0 12px;">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

// Изменение количества
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
    }
}

// Добавление в корзину
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showNotification('Товар добавлен в корзину');
}

// Уведомление
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = 'position:fixed; bottom:20px; right:20px; background:var(--accent); color:black; padding:12px 24px; z-index:1001;';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Рендер товаров
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    let filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-card__image">${product.icon}</div>
            <div class="product-card__title">${product.name}</div>
            <div class="product-card__category">${product.category === 'hoodies' ? 'ХУДИ' : product.category === 't-shirts' ? 'ФУТБОЛКИ' : product.category === 'pants' ? 'ШТАНЫ' : 'АКСЕССУАРЫ'}</div>
            <div class="product-card__price">${product.price.toLocaleString()} ₽</div>
            <button class="product-card__btn" onclick="addToCart(${product.id})">В КОРЗИНУ</button>
        </div>
    `).join('');
}

// Фильтры
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });
}

// Корзина модалка
function initCartModal() {
    const cartBtn = document.querySelector('.cart-btn');
    const modal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (cartBtn) cartBtn.addEventListener('click', () => modal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showNotification('Заказ оформлен! Спасибо!');
            cart = [];
            saveCart();
            modal.classList.remove('active');
        }
    });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

// Слайдер
function initSlider() {
    let current = 0;
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
}

// Тема
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('fashion_theme');
    if (saved === 'light') {
        document.body.style.background = '#ffffff';
        document.body.style.color = '#000000';
        btn.textContent = '🌙';
    }
    btn.addEventListener('click', () => {
        const isDark = document.body.style.background !== '#ffffff';
        if (isDark) {
            document.body.style.background = '#ffffff';
            document.body.style.color = '#000000';
            btn.textContent = '🌙';
            localStorage.setItem('fashion_theme', 'light');
        } else {
            document.body.style.background = '#000000';
            document.body.style.color = '#ffffff';
            btn.textContent = '☀️';
            localStorage.setItem('fashion_theme', 'dark');
        }
    });
}

// Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('.nav__link, .btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Форма
function initForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('formMessage');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            if (name && email) {
                msg.innerHTML = '✅ Сообщение отправлено!';
                form.reset();
                setTimeout(() => msg.innerHTML = '', 3000);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSlider();
    initFilters();
    initCartModal();
    initSmoothScroll();
    initForm();
    renderProducts();
    updateCartUI();
});

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
