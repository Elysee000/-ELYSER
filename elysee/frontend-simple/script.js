// Products Database
const products = [
    { id: 1, name: 'Laptop Pro', price: 1299, emoji: '💻', category: 'electronics' },
    { id: 2, name: 'Wireless Mouse', price: 39, emoji: '🖱️', category: 'accessories' },
    { id: 3, name: 'Headphones', price: 199, emoji: '🎧', category: 'electronics' },
    { id: 4, name: 'Designer Watch', price: 299, emoji: '⌚', category: 'fashion' },
    { id: 5, name: 'Leather Bag', price: 189, emoji: '👜', category: 'fashion' },
    { id: 6, name: 'Monitor 4K', price: 499, emoji: '🖥️', category: 'electronics' },
    { id: 7, name: 'Phone Case', price: 29, emoji: '📱', category: 'accessories' },
    { id: 8, name: 'Sunglasses', price: 149, emoji: '😎', category: 'fashion' },
    { id: 9, name: 'Mechanical Keyboard', price: 159, emoji: '⌨️', category: 'electronics' },
    { id: 10, name: 'Smart Watch', price: 399, emoji: '⌚', category: 'electronics' },
    { id: 11, name: 'USB-C Cable', price: 15, emoji: '🔌', category: 'accessories' },
    { id: 12, name: 'Phone Stand', price: 25, emoji: '📱', category: 'accessories' }
];

// State Management
const state = {
    cart: [],
    filters: { electronics: false, accessories: false, fashion: false },
    posts: [],
    shorts: [],
    chatMessages: [],
    userColors: {
        primary: '#10b981',
        secondary: '#8b5cf6',
        accent: '#f59e0b'
    },
    users: [],
    currentUser: null,
    messages: [],
    friends: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupColorCustomizer();
    renderProducts();
    renderShorts();
    renderPosts();
    initializeFilters();
    loadChatHistory();
    updateCartCount();
    initializeUsers();
}

// Storage
function loadFromStorage() {
    const saved = localStorage.getItem('elysee-state');
    if (saved) {
        const data = JSON.parse(saved);
        state.cart = data.cart || [];
        state.posts = data.posts || [];
        state.chatMessages = data.chatMessages || [];
        state.userColors = data.userColors || state.userColors;
        state.users = data.users || [];
        state.messages = data.messages || [];
        state.friends = data.friends || [];
        applyColors();
    }
    checkLoginStatus();
}

function saveToStorage() {
    localStorage.setItem('elysee-state', JSON.stringify(state));
}

// Color Customizer
function setupColorCustomizer() {
    const toggle = document.getElementById('colorToggle');
    const panel = document.getElementById('colorPanel');

    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    // Couleurs fixées - Blanc, Vert, Noir
    state.userColors = {
        primary: '#10b981',
        secondary: '#ffffff',
        accent: '#000000'
    };

    // Set current colors in inputs (disabled - no changes allowed)
    document.getElementById('primaryColor').value = state.userColors.primary;
    document.getElementById('secondaryColor').value = state.userColors.secondary;
    document.getElementById('accentColor').value = state.userColors.accent;
    
    applyColors();
}

function applyColors() {
    const root = document.documentElement;
    root.style.setProperty('--primary', '#10b981');
    root.style.setProperty('--secondary', '#ffffff');
    root.style.setProperty('--accent', '#000000');
}

function resetColors() {
    state.userColors = {
        primary: '#10b981',
        secondary: '#ffffff',
        accent: '#000000'
    };
    document.getElementById('primaryColor').value = state.userColors.primary;
    document.getElementById('secondaryColor').value = state.userColors.secondary;
    document.getElementById('accentColor').value = state.userColors.accent;
    applyColors();
    saveToStorage();
    showToast('Thème Blanc-Vert-Noir appliqué');
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageName}`);
    if (page) {
        page.classList.add('active');
        
        // Load conversations when opening messages page
        if (pageName === 'messages') {
            loadConversations();
        }
        // Update profile when opening profile page
        if (pageName === 'profile') {
            updateAuthUI();
        }
    }
    window.scrollTo(0, 0);
}

// Products & Shop
function initializeFilters() {
    document.querySelectorAll('.filter-check').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            state.filters[checkbox.value] = checkbox.checked;
            renderProducts();
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const activeFilters = Object.keys(state.filters).filter(f => state.filters[f]);
    const filtered = activeFilters.length > 0
        ? products.filter(p => activeFilters.includes(p.category))
        : products;

    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-card-image">${product.emoji}</div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-category">${product.category}</p>
                <p class="product-card-price">${product.price}€</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width: 100%;">
                    Ajouter
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = state.cart.find(i => i.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    saveToStorage();
    updateCartCount();
    showToast(`${product.name} ajouté!`);
}

function updateCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Cart Page
function renderCart() {
    const itemsContainer = document.getElementById('cartItems');
    if (!itemsContainer) return;

    if (state.cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-state">
                <p>Votre panier est vide</p>
                <button class="btn btn-primary" onclick="showPage('shop')">Continuer</button>
            </div>
        `;
        updateCartSummary();
        return;
    }

    itemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.price}€</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQty(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQty(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId);
        else {
            saveToStorage();
            renderCart();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveToStorage();
    renderCart();
    updateCartCount();
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + '€';
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratuit' : shipping + '€';
    if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
}

document.addEventListener('DOMContentLoaded', () => {
    const cartPage = document.getElementById('page-cart');
    if (cartPage) {
        const observer = new MutationObserver(() => renderCart());
        observer.observe(cartPage, { attributes: true, attributeFilter: ['class'] });
    }
});

// Shorts Page
function renderShorts() {
    const container = document.getElementById('shortsContainer');
    if (!container) return;

    const shorts = [
        { id: 1, author: 'ElyseeShop', emoji: '🎁', text: 'Nouvelle collection disponible!', likes: 234, comments: 45 },
        { id: 2, author: 'Team Elysee', emoji: '💎', text: 'Produits premium à prix cassés', likes: 567, comments: 89 },
        { id: 3, author: 'Shop Master', emoji: '🚀', text: 'Livraison gratuite ce week-end', likes: 890, comments: 123 }
    ];

    container.innerHTML = shorts.map(short => `
        <div class="short-card">
            <div class="short-video">${short.emoji}</div>
            <div class="short-info">
                <div class="short-author">${short.author}</div>
                <div class="short-text">${short.text}</div>
                <div class="short-actions">
                    <div class="short-action" onclick="toggleLike(this)">❤️ ${short.likes}</div>
                    <div class="short-action">💬 ${short.comments}</div>
                    <div class="short-action">📤</div>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleLike(element) {
    element.classList.toggle('liked');
    const current = parseInt(element.textContent.match(/\d+/)[0]);
    const isLiked = element.classList.contains('liked');
    element.textContent = '❤️ ' + (isLiked ? current + 1 : current - 1);
}

// Posts Page
function renderPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    const defaultPosts = [
        { id: 1, author: 'Marie', text: 'Adoré mes achats chez ElyseeShop!', time: '2 heures', likes: 45, comments: 8 },
        { id: 2, author: 'Jean', text: 'Livraison super rapide 🚀', time: '5 heures', likes: 120, comments: 15 },
        { id: 3, author: 'Sophie', text: 'Qualité exceptionnelle!', time: '1 jour', likes: 234, comments: 32 }
    ];

    const allPosts = [...defaultPosts, ...state.posts];

    container.innerHTML = allPosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-time">${post.time || 'maintenant'}</span>
            </div>
            <div class="post-text">${post.text}</div>
            <div class="post-actions">
                <div class="post-action" onclick="toggleLike(this)">❤️ ${post.likes || 0}</div>
                <div class="post-action">💬 ${post.comments || 0}</div>
            </div>
        </div>
    `).join('');
}

function openPostModal() {
    document.getElementById('postModal').classList.add('active');
}

function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
    document.getElementById('postText').value = '';
}

function createPost() {
    const text = document.getElementById('postText').value.trim();
    if (!text) {
        showToast('Écrivez quelque chose!');
        return;
    }

    state.posts.unshift({
        id: Date.now(),
        author: 'Vous',
        text: text,
        time: 'maintenant',
        likes: 0,
        comments: 0
    });

    saveToStorage();
    renderPosts();
    closePostModal();
    showToast('Post publié!');
}

// Games
function showGameModal(gameName) {
    const modal = document.getElementById('gameModal');
    const content = document.getElementById('gameContent');

    const games = {
        dice: '<div style="text-align: center; padding: 2rem;"><div style="font-size: 5rem; margin: 2rem 0;" id="diceResult">🎲</div><button class="btn btn-primary" onclick="rollDice()" style="font-size: 1.2rem; padding: 1rem 2rem;">Lancer</button></div>',
        memory: '<div id="memoryGame" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem;"></div>'
    };

    content.innerHTML = games[gameName] || `<div style="padding: 2rem; text-align: center;"><p>Jeu: ${gameName}</p><p>Bientôt disponible!</p></div>`;

    if (gameName === 'memory') {
        initMemoryGame();
    }

    modal.classList.add('active');
}

function closeGameModal() {
    document.getElementById('gameModal').classList.remove('active');
}

function rollDice() {
    const result = Math.floor(Math.random() * 6) + 1;
    const emoji = ['🎲', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
    document.getElementById('diceResult').textContent = emoji[result];
    showToast('Résultat: ' + result);
}

function initMemoryGame() {
    const cards = ['🎮', '🎨', '🎭', '🎪', '🎸', '🎯', '🎲', '🎳'];
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);

    const gameDiv = document.getElementById('memoryGame');
    gameDiv.innerHTML = gameCards.map((card, i) => `
        <div style="width: 80px; height: 80px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; user-select: none;" onclick="this.textContent = '${card}'">
            ?
        </div>
    `).join('');
}

// Chat
function loadChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatMessages.innerHTML = state.chatMessages.map(msg => `
        <div class="chat-message ${msg.type}">
            ${msg.text}
        </div>
    `).join('');

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text) return;

    state.chatMessages.push({ type: 'user', text: text });

    // Auto response
    setTimeout(() => {
        const responses = [
            'Merci de votre message! 😊',
            'Comment puis-je vous aider?',
            'Nous traitons votre demande...',
            'À bientôt! 👋'
        ];
        state.chatMessages.push({ type: 'admin', text: responses[Math.floor(Math.random() * responses.length)] });
        loadChatHistory();
    }, 500);

    input.value = '';
    loadChatHistory();
    saveToStorage();
}

// Checkout
function handleCheckout(e) {
    e.preventDefault();

    if (state.cart.length === 0) {
        showToast('Panier vide!');
        return;
    }

    setTimeout(() => {
        showModal('successModal');
        state.cart = [];
        updateCartCount();
        saveToStorage();
        e.target.reset();
    }, 1000);
}

// Modals
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    showPage('shop');
}

// Toast Notifications
function showToast(message) {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Authentication Functions
function initializeUsers() {
    // Add some demo users if none exist
    if (state.users.length === 0) {
        state.users = [
            {
                id: 1001,
                name: 'Alice Dupont',
                email: 'alice@example.com',
                password: btoa('password123'),
                avatar: '👩‍💼',
                bio: 'Passionnée par le shopping',
                followers: 150,
                following: 80,
                createdAt: '01/01/2024'
            },
            {
                id: 1002,
                name: 'Bob Martin',
                email: 'bob@example.com',
                password: btoa('password123'),
                avatar: '👨‍💻',
                bio: 'Tech enthusiast',
                followers: 200,
                following: 120,
                createdAt: '05/01/2024'
            }
        ];
        
        // Add some demo friendships
        state.friends = [
            { userId: 1001, friendId: 1002, online: true },
            { userId: 1002, friendId: 1001, online: false }
        ];
        
        // Add some demo messages
        state.messages = [
            {
                id: 1,
                senderId: 1001,
                recipientId: 1002,
                text: 'Salut! Comment ça va?',
                timestamp: '14:30',
                read: true
            },
            {
                id: 2,
                senderId: 1002,
                recipientId: 1001,
                text: 'Ça va bien, et toi?',
                timestamp: '14:35',
                read: false
            }
        ];
        
        saveToStorage();
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !password) {
        showToast('Veuillez remplir tous les champs');
        return;
    }

    if (password.length < 6) {
        showToast('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    if (password !== passwordConfirm) {
        showToast('Les mots de passe ne correspondent pas');
        return;
    }

    if (state.users.find(u => u.email === email)) {
        showToast('Cet email est déjà utilisé');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: btoa(password), // Simple encoding (NOT for production!)
        avatar: '👤',
        bio: '',
        followers: 0,
        following: 0,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        logo: null,              // Logo profile (base64)
        photos: [],              // Photos array (base64)
        videos: []               // Videos array (base64)
    };

    state.users.push(newUser);
    state.currentUser = newUser;
    saveToStorage();
    updateAuthUI();
    setupMediaUploads();         // Setup media uploads après inscription
    showToast('Compte créé avec succès!');
    showPage('profile');         // Aller au profil au lieu du shop
    e.target.reset();
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = state.users.find(u => u.email === email && u.password === btoa(password));

    if (!user) {
        showToast('Email ou mot de passe incorrect');
        return;
    }

    state.currentUser = user;
    saveToStorage();
    updateAuthUI();
    showToast('Bienvenue ' + user.name + '!');
    showPage('shop');
    e.target.reset();
}

function logout() {
    state.currentUser = null;
    saveToStorage();
    updateAuthUI();
    showToast('Déconnecté');
    showPage('shop');
}

function checkLoginStatus() {
    if (state.currentUser) {
        updateAuthUI();
    }
}

function updateAuthUI() {
    const logoutBtn = document.getElementById('logoutBtn');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const userProfileContent = document.getElementById('userProfileContent');

    if (state.currentUser) {
        logoutBtn.style.display = 'inline-block';
        profileName.textContent = state.currentUser.name;
        profileEmail.textContent = state.currentUser.email;
        userProfileContent.style.display = 'block';
        
        // Update stats
        document.getElementById('orderCount').textContent = state.cart.length;
        document.getElementById('postCount').textContent = state.posts.filter(p => p.author === state.currentUser.name).length;
        document.getElementById('friendCount').textContent = state.friends.filter(f => f.userId === state.currentUser.id).length;

        renderFriendsList();
        setupMediaUploads();  // Setup media uploads
        renderMedias();       // Render existing medias
    } else {
        logoutBtn.style.display = 'none';
        userProfileContent.style.display = 'none';
    }
}

function renderFriendsList() {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) return;

    const userFriends = state.friends.filter(f => f.userId === state.currentUser.id);
    
    if (userFriends.length === 0) {
        friendsList.innerHTML = '<p style="color: #cbd5e1; text-align: center;">Aucun ami pour le moment</p>';
        return;
    }

    friendsList.innerHTML = userFriends.map(friend => {
        const user = state.users.find(u => u.id === friend.friendId);
        return `
            <div class="friend-item">
                <div class="friend-avatar">${user?.avatar || '👤'}</div>
                <div class="friend-name">${user?.name || 'Utilisateur'}</div>
                <div class="friend-status ${friend.online ? '' : 'offline'}"></div>
            </div>
        `;
    }).join('');
}

function loadConversations() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList || !state.currentUser) return;

    const userConversations = state.messages
        .filter(m => m.senderId === state.currentUser.id || m.recipientId === state.currentUser.id)
        .map(m => {
            const otherId = m.senderId === state.currentUser.id ? m.recipientId : m.senderId;
            const otherUser = state.users.find(u => u.id === otherId);
            return {
                userId: otherId,
                userName: otherUser?.name || 'Utilisateur',
                lastMessage: m.text,
                unread: m.recipientId === state.currentUser.id && !m.read
            };
        });

    const uniqueConversations = Array.from(new Map(userConversations.map(c => [c.userId, c])).values());

    conversationsList.innerHTML = uniqueConversations.map(conv => `
        <div class="conversation-item ${conv.unread ? '' : ''}" onclick="openConversation(${conv.userId}, '${conv.userName}')">
            <div class="conversation-name">${conv.userName}</div>
            <div class="conversation-preview">${conv.lastMessage}</div>
            ${conv.unread ? '<div class="unread-badge">1</div>' : ''}
        </div>
    `).join('');
}

function openConversation(userId, userName) {
    const messageThread = document.getElementById('messageThread');
    const messageInput = document.getElementById('messageInput');
    
    state.selectedConversation = userId;
    
    const conversation = state.messages.filter(m => 
        (m.senderId === state.currentUser.id && m.recipientId === userId) ||
        (m.senderId === userId && m.recipientId === state.currentUser.id)
    );

    messageThread.innerHTML = conversation.map(msg => `
        <div class="message-item ${msg.senderId === state.currentUser.id ? 'sent' : ''}">
            <div class="message-content">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.timestamp}</div>
            </div>
        </div>
    `).join('');

    messageThread.scrollTop = messageThread.scrollHeight;
}

function sendPrivateMessage() {
    if (!state.currentUser || !state.selectedConversation) {
        showToast('Veuillez d\'abord sélectionner une conversation');
        return;
    }

    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text) return;

    const message = {
        id: Date.now(),
        senderId: state.currentUser.id,
        recipientId: state.selectedConversation,
        text: text,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false
    };

    state.messages.push(message);
    saveToStorage();
    input.value = '';
    openConversation(state.selectedConversation, '');
    loadConversations();
}

// Media Upload Functions
function setupMediaUploads() {
    if (!state.currentUser) return;

    // Logo upload
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => handleLogoUpload(e));
    }

    // Photos upload
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', (e) => handlePhotosUpload(e));
    }

    // Videos upload
    const videoUpload = document.getElementById('videoUpload');
    if (videoUpload) {
        videoUpload.addEventListener('change', (e) => handleVideosUpload(e));
    }

    renderMedias();
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB max
        showToast('Logo trop volumineux (max 5MB)');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        state.currentUser.logo = event.target.result;
        saveToStorage();
        renderMedias();
        showToast('Logo téléchargé! ✅');
    };
    reader.readAsDataURL(file);
}

function handlePhotosUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    let loaded = 0;
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB max
            showToast('Une photo dépasse 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            state.currentUser.photos.push({
                id: Date.now() + Math.random(),
                data: event.target.result
            });
            loaded++;
            if (loaded === files.length) {
                saveToStorage();
                renderMedias();
                showToast(`${loaded} photo(s) téléchargée(s)! ✅`);
            }
        };
        reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
}

function handleVideosUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    let loaded = 0;
    files.forEach(file => {
        if (file.size > 50 * 1024 * 1024) { // 50MB max for videos
            showToast('Une vidéo dépasse 50MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            state.currentUser.videos.push({
                id: Date.now() + Math.random(),
                data: event.target.result
            });
            loaded++;
            if (loaded === files.length) {
                saveToStorage();
                renderMedias();
                showToast(`${loaded} vidéo(s) téléchargée(s)! ✅`);
            }
        };
        reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
}

function renderMedias() {
    if (!state.currentUser) return;

    // Logo
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview) {
        if (state.currentUser.logo) {
            logoPreview.innerHTML = `<img src="${state.currentUser.logo}" alt="Logo">`;
            const logoImg = document.getElementById('profileLogoImg');
            if (logoImg) {
                logoImg.src = state.currentUser.logo;
                logoImg.style.display = 'block';
            }
        } else {
            logoPreview.innerHTML = '<span style="color: #cbd5e1;">Aucun logo</span>';
        }
    }

    // Photos
    const photosGrid = document.getElementById('photosGrid');
    if (photosGrid) {
        if (state.currentUser.photos.length === 0) {
            photosGrid.innerHTML = '<p style="color: #cbd5e1; grid-column: 1/-1;">Aucune photo</p>';
        } else {
            photosGrid.innerHTML = state.currentUser.photos.map(photo => `
                <div class="photo-item">
                    <img src="${photo.data}" alt="Photo">
                    <button class="media-delete" onclick="deletePhoto(${photo.id})" title="Supprimer">×</button>
                </div>
            `).join('');
        }
    }

    // Videos
    const videosGrid = document.getElementById('videosGrid');
    if (videosGrid) {
        if (state.currentUser.videos.length === 0) {
            videosGrid.innerHTML = '<p style="color: #cbd5e1; grid-column: 1/-1;">Aucune vidéo</p>';
        } else {
            videosGrid.innerHTML = state.currentUser.videos.map(video => `
                <div class="video-item">
                    <video src="${video.data}" controls></video>
                    <button class="media-delete" onclick="deleteVideo(${video.id})" title="Supprimer">×</button>
                </div>
            `).join('');
        }
    }
}

function deletePhoto(photoId) {
    if (!state.currentUser) return;
    state.currentUser.photos = state.currentUser.photos.filter(p => p.id !== photoId);
    saveToStorage();
    renderMedias();
    showToast('Photo supprimée');
}

function deleteVideo(videoId) {
    if (!state.currentUser) return;
    state.currentUser.videos = state.currentUser.videos.filter(v => v.id !== videoId);
    saveToStorage();
    renderMedias();
    showToast('Vidéo supprimée');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Update cart when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && document.getElementById('page-cart').classList.contains('active')) {
            renderCart();
        }
    });
});
