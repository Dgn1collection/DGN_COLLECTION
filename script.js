// Configuration intégrée
const CONFIG = {
    WHATSAPP_NUMBER: '+213790913094',
    SITE_NAME: 'DGN Collection'
};

// Source des données: false = utiliser UNIQUEMENT les données intégrées dans ce script
// true = essayer de charger data/*.json puis retomber sur les valeurs intégrées
const LOAD_FROM_JSON = false;

// État global de l'application
let products = [];
let ads = [];

let cart = [];
let isCartOpen = false;
let currentFilter = 'all';

// Variables pour les annonces
let currentAdIndex = 0;
let adsInterval = null;

// Chargement des données depuis JSON avec repli sur les valeurs par défaut
async function loadDataFromJSON() {
    if (!LOAD_FROM_JSON) {
        products = getDefaultProducts();
        ads = getDefaultAds();
        console.log('✅ Données intégrées utilisées (LOAD_FROM_JSON=false)');
        return;
    }
    const ts = Date.now();
    const random = Math.random().toString(36).substring(7);
    try {
        const origin = window.location.origin;
        // Force le rechargement avec cache: 'reload' et headers
        const fetchOptions = {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        };
        
        const [productsRes, adsRes] = await Promise.all([
            fetch(`${origin}/data/products.json?v=${ts}&r=${random}`, fetchOptions),
            fetch(`${origin}/data/ads.json?v=${ts}&r=${random}`, fetchOptions)
        ]);
        
        if (productsRes.ok) {
            const productsJson = await productsRes.json();
            products = Array.isArray(productsJson) ? productsJson : (productsJson.products || []);
            console.log('✅ Produits chargés depuis JSON:', products.length, products.map(p => p.name));
        } else {
            console.warn('⚠️ Produits JSON non disponible, utilisation par défaut');
            products = getDefaultProducts();
        }
        
        if (adsRes.ok) {
            const adsJson = await adsRes.json();
            ads = Array.isArray(adsJson) ? adsJson : (adsJson.ads || []);
            console.log('✅ Annonces chargées depuis JSON:', ads.length);
        } else {
            console.warn('⚠️ Annonces JSON non disponible, utilisation par défaut');
            ads = getDefaultAds();
        }
        
        if (!products || products.length === 0) {
            console.warn('⚠️ Aucun produit trouvé, utilisation par défaut');
            products = getDefaultProducts();
        }
        if (!ads || ads.length === 0) {
            console.warn('⚠️ Aucune annonce trouvée, utilisation par défaut');
            ads = getDefaultAds();
        }
        
        console.log('✅ Données finales chargées', { produits: products.length, annonces: ads.length });
    } catch (e) {
        console.error('❌ Erreur de chargement JSON:', e);
        console.warn('⚠️ Utilisation des données par défaut');
        products = getDefaultProducts();
        ads = getDefaultAds();
    }
}















// Données par défaut pour les produits
function getDefaultProducts() {
    return [
    {
        id: 1,
        name: "Chemise Homme Classique",
        description: "Chemise en coton premium pour homme, coupe moderne et élégante.",
        price: 3200,
        image: "https://hartford.fr/cdn/shop/files/BD11015-03-01.jpg?v=1737967098&width=1920",
        color: "Bleu",
        available: true,
        category: "Homme",
        stock: 35
    },
    {
        id: 2,
        name: "Pantalon Homme Chino",
        description: "Pantalon chino en coton stretch, confortable et stylé.",
        price: 2800,
        image: "https://cyrillus.fr/cdn/shop/files/04700_0532_9006_PO_FA_F1XX_7f5500f4-8196-48dc-96bb-fca72e9cbabd.jpg?v=1741379502",
        color: "Beige",
        available: true,
        category: "Homme",
        stock: 25
    },
    {
        id: 3,
        name: "Veste Homme Blazer",
        description: "Blazer moderne pour homme, parfait pour le bureau et les sorties.",
        price: 5500,
        image: "https://macktenfashion.com/cdn/shop/files/BLAZER_MARINE_HOMME.jpg?v=1742296930",
        color: "Gris",
        available: true,
        category: "Homme",
        stock: 18
    },


    {
        id: 4,
        name: "Robe Femme Été",
        description: "Robe légère et fluide pour femme, parfaite pour l'été.",
        price: 2400,
        image: "https://www.vibs.com/on/demandware.static/-/Sites-Breal_master/default/dwdc9b1ac5/robe-evasee-manches-courtes-orange-femme-vue7-36125133701164992.jpg",
        color: "Rose",
        available: true,
        category: "Femme",
        stock: 30
    },
    {
        id: 5,
        name: "Maillot de bain femme",
        description: "Top en coton bio pour femme, style décontracté et confortable.",
        price: 1800,
        image: "https://www.cdiscount.com/pdt2/4/5/0/1/700x700/mp62483450/rw/maillot-de-bain-femme-1-piece-col-en-v-profond-sex.jpg",
        color: "Blanc",
        available: true,
        category: "Femme",
        stock: 40
    },
    {
        id: 6,
        name: "Jupe Femme Midi",
        description: "Jupe midi élégante pour femme, idéale pour toutes les occasions.",
        price: 2200,
        image: "https://www.cache-cache.fr/on/demandware.static/-/Sites-Cache_cache_master/default/dwdff98481/jupe-midi-droite-noir-femme-vue7-36125332270331001.jpg",
        color: "Noir",
        available: true,
        category: "Femme",
        stock: 22
    },
    {
        id: 7,
        name: "T-shirt REAL MADRID Enfant",
        description: "T-shirt coloré pour enfant garçon, coton doux et résistant.",
        price: 1200,
        image: "https://images.prodirectsport.com/ProductImages/Gallery_4/1036229_Gallery_4_1994055.jpg",
        color: "BLANC",
        available: true,
        category: "Enfant",
        stock: 50
    },
    {
        id: 8,
        name: "Robe Enfant Fille",
        description: "Robe adorable pour petite fille, design mignon et confortable.",
        price: 1500,
        image: "https://www.vertbaudet.com/fstrz/r/s/media.vertbaudet.com/Pictures/vertbaudet/60389/robe-ceremonie-fille-satin-et-tulle.jpg?width=457",
        color: "Rose",
        available: true,
        category: "Enfant",
        stock: 35
    },
    {
        id: 9,
        name: "Short Enfant Mixte",
        description: "Short en coton pour enfant, parfait pour jouer et s'amuser.",
        price: 1000,
        image: "https://fft-fft-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/886/886/c6355d06160cf7be76adf0edffb7825b25b623f1_GJ7483_70V_21.jpg",
        color: "BLANC",
        available: true,
        category: "Enfant",
        stock: 45
    }
];
}






























// Données par défaut pour les annonces
function getDefaultAds() {
    return [
    {
        id: 1,
        title: "Nouvelle Collection Hiver",
        description: "Découvrez notre nouvelle collection d'hiver avec des prix imbattables et des designs exclusifs !",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&auto=format",
        link: "#products",
        active: true,
        duration: 6000,
        type: "image"
    },
    {
        id: 2,
        title: "Soldes d'Été -50%",
        description: "Profitez de nos soldes d'été exceptionnels avec jusqu'à -50% sur tous les articles sélectionnés !",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&auto=format",
        link: "#products",
        active: true,
        duration: 6000,
        type: "image"
    },
    {
        id: 3,
        title: "Livraison Gratuite",
        description: "Livraison gratuite pour toute commande supérieure à 5000 DA ! Commandez maintenant et recevez vos articles rapidement.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format",
        link: "#contact",
        active: true,
        duration: 6000,
        type: "image"
    },
    {
        id: 4,
        title: "Nouveau Arrivage",
        description: "Découvrez nos nouveaux produits fraîchement arrivés ! Qualité premium et prix imbattables.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&auto=format",
        link: "#products",
        active: true,
        duration: 6000,
        type: "image"
    }
];
}

// Fonction pour recharger les données depuis les fichiers JSON
async function reloadData() {
    console.log('🔄 Rechargement des données...');
    await loadDataFromJSON();
    renderProducts();
    initializeAds();
    showNotification('Données actualisées !');
}

// Fonction pour rafraîchir les annonces
function refreshAds() {
    if (adsInterval) {
        clearInterval(adsInterval);
    }
    initializeAds();
    showNotification('Annonces actualisées !');
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Démarrage de l\'application DGN Collection');
    
    try {
        // Charger les données depuis les fichiers JSON
        await loadDataFromJSON();
        
        // Configuration des événements en premier
        setupEventListeners();
        console.log('✅ Événements configurés');
        
        // Initialiser l'application
        await initializeApp();
        console.log('✅ Application initialisée');
        
        // Rendre les produits
        renderProducts();
        
        // Initialiser les annonces
        initializeAds();
        console.log('✅ Annonces initialisées');
        
        // Configurer les animations
        setupScrollAnimations();
        console.log('✅ Animations configurées');
        
        console.log('🎉 Application entièrement chargée !');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement de l\'application');
    }
});

// Sauvegarde du panier (désactivée pour éviter la persistance entre rechargements)
function saveCart() {
    // Intentionnellement vide: pas de persistance
}

// Toggle du panier
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Ouverture de la modal de commande
function openOrderModal() {
    if (cart.length === 0) return;
    // Fermer le panier si ouvert avant d'afficher la modal
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartSidebar && cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
        isCartOpen = false;
    }

    const orderModal = document.getElementById('orderModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const orderSummary = document.getElementById('orderSummary');
    
    // Génération du résumé de commande
    orderSummary.innerHTML = generateOrderSummary();
    
    orderModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fermeture de la modal de commande
function closeOrderModal() {
    const orderModal = document.getElementById('orderModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    orderModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Génération du résumé de commande
function generateOrderSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let summary = '<h4>Résumé de votre commande</h4><ul>';
    
    cart.forEach(item => {
        summary += `
            <li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)} DA</span>
            </li>
        `;
    });
    
    summary += `
        </ul>
        <div style="border-top: 2px solid #001f3f; padding-top: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                <span>Total:</span>
                <span>${formatPrice(total)} DA</span>
            </div>
        </div>
    `;
    
    return summary;
}

// Gestion de la soumission de commande
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const fullName = (document.getElementById('fullName')?.value || '').trim();
    const phone = document.getElementById('phone').value;
    const notes = document.getElementById('notes').value;
    
    if (!fullName) {
        showError('Veuillez entrer votre nom complet');
        return;
    }
    if (!phone) {
        showError('Veuillez entrer votre numéro de téléphone');
        return;
    }
    
    try {
        // Calculer le total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Sauvegarder la commande
        const orderData = {
            fullName: fullName,
            phone: phone,
            notes: notes,
            items: [...cart], // Copie du panier
            total: total
        };
        
        // Sauvegarder la commande dans localStorage
        const orders = JSON.parse(localStorage.getItem('ndgOrders') || '[]');
        const newOrder = {
            id: Date.now(),
            ...orderData,
            date: new Date().toISOString()
        };
        orders.push(newOrder);
        localStorage.setItem('ndgOrders', JSON.stringify(orders));
        console.log('✅ Commande sauvegardée:', newOrder);
        
        // Génération du message WhatsApp
        const message = generateWhatsAppMessage(fullName, phone, notes);
        const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        
        // Ouverture de WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Fermeture de la modal
        closeOrderModal();
        
        // Vidage du panier
        cart = [];
        updateCartUI();
        saveCart();
        renderProducts();
        
        showNotification('Commande envoyée via WhatsApp et sauvegardée !');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la commande:', error);
        showError('Erreur lors de la sauvegarde de la commande');
    }
}

// Génération du message WhatsApp pour les commandes
function generateWhatsAppMessage(fullName, phone, notes) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = `🛍️ *NOUVELLE COMMANDE DGN COLLECTION*\n\n`;
    if (fullName) message += `👤 *Nom:* ${fullName}\n`;
    message += `📱 *Téléphone:* ${phone}\n\n`;
    message += `📋 *Articles commandés:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)} DA\n`;
    });
    
    message += `\n💰 *Total: ${formatPrice(total)} DA*\n\n`;
    
    if (notes) {
        message += `📝 *Notes:* ${notes}\n\n`;
    }
    
    message += `Merci pour votre commande ! Nous vous contacterons bientôt.`;
    
    return message;
}

// Gestion du formulaire de contact
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        date: new Date().toISOString()
    };
    
    // Sauvegarder le message de contact
    const contacts = JSON.parse(localStorage.getItem('ndgContacts') || '[]');
    contacts.push({
        id: Date.now(),
        ...contactData
    });
    localStorage.setItem('ndgContacts', JSON.stringify(contacts));
    
    // Générer le message WhatsApp pour le contact
    const whatsappMessage = generateContactWhatsAppMessage(contactData);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Réinitialiser le formulaire
    e.target.reset();
    
    showNotification('Message envoyé via WhatsApp et sauvegardé !');
}

// Génération du message WhatsApp pour les contacts
function generateContactWhatsAppMessage(contactData) {
    let message = `📧 *NOUVEAU MESSAGE DE CONTACT DGN COLLECTION*\n\n`;
    message += `👤 *Nom:* ${contactData.name}\n`;
    message += `📧 *Email:* ${contactData.email}\n`;
    message += `📱 *Téléphone:* ${contactData.phone}\n`;
    message += `📋 *Sujet:* ${contactData.subject}\n\n`;
    message += `💬 *Message:*\n${contactData.message}\n\n`;
    message += `📅 *Date:* ${new Date(contactData.date).toLocaleString('fr-FR')}\n\n`;
    message += `Merci pour votre message ! Nous vous répondrons rapidement.`;
    
    return message;
}

// Navigation fluide
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Mise à jour du lien de navigation actif
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Configuration des animations de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec la classe scroll-reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
}

// Animation au scroll - Améliorée
function animateOnScroll() {
    let ticking = false;
    let lastScrollY = 0;
    
    function updateAnimations() {
        const scrolled = window.pageYOffset;
        const direction = scrolled > lastScrollY ? 'down' : 'up';
        
        // Effet de parallaxe subtil pour le hero
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            const parallax = scrolled * 0.3;
            hero.style.transform = `translateY(${parallax}px)`;
        }
        
        // Amélioration de la performance
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
        scrollRevealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
        
        lastScrollY = scrolled;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Optimisation du scroll avec throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(requestTick, 16); // ~60fps
    });
}

// Formatage des prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ').format(price);
}

// Affichage des notifications
function showNotification(message) {
    // Création de la notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #001f3f;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 31, 63, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Affichage des erreurs
function showError(message) {
    const error = document.createElement('div');
    error.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    error.textContent = message;
    
    document.body.appendChild(error);
    
    setTimeout(() => {
        error.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        error.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(error);
        }, 300);
    }, 4000);
}

// Gestion du responsive
function handleResize() {
    // Fermeture du panier sur mobile lors du redimensionnement
    if (window.innerWidth > 768 && isCartOpen) {
        toggleCart();
    }
}

window.addEventListener('resize', handleResize);

// Préchargement des images avec gestion d'erreur
function preloadImages() {
    console.log('🖼️ Préchargement des images...');
    
    // Précharger les images des produits
    products.forEach(product => {
        if (product.image) {
            const img = new Image();
            img.onload = () => {
                console.log('✅ Image chargée:', product.name);
            };
            img.onerror = () => {
                console.warn('⚠️ Erreur de chargement:', product.name, product.image);
                product.image = getPlaceholderImage();
            };
            img.src = product.image;
        }
    });
    
    // Précharger les images des annonces
    ads.forEach(ad => {
        if (ad.type === 'image' && ad.image) {
            const img = new Image();
            img.onload = () => {
                console.log('✅ Annonce chargée:', ad.title);
            };
            img.onerror = () => {
                console.warn('⚠️ Erreur de chargement annonce:', ad.title, ad.image);
                ad.image = getAdPlaceholderImage();
            };
            img.src = ad.image;
        }
    });
}

// Correction des problèmes de formatage
function fixLayoutIssues() {
    // Forcer le recalcul du layout
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Corriger les hauteurs des sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.offsetHeight < 200) {
            section.style.minHeight = '200px';
        }
    });
    
    // S'assurer que le contenu est bien positionné
    const main = document.querySelector('.main');
    if (main) {
        main.style.position = 'relative';
        main.style.zIndex = '1';
    }
    
    // Corriger les problèmes de scroll
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
}

// Optimisation des performances
function optimizePerformance() {
    // Lazy loading pour les images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimisation du scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Forcer le recalcul du layout si nécessaire
            if (window.pageYOffset > 0) {
                document.body.style.transform = 'translateZ(0)';
            }
        }, 16);
    });
    
    // Préchargement des ressources critiques
    preloadCriticalResources();
}

// Préchargement des ressources critiques
function preloadCriticalResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&auto=format'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialisation des optimisations
document.addEventListener('DOMContentLoaded', () => {
    optimizePerformance();
    preloadImages();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    showError('Une erreur est survenue. Veuillez recharger la page.');
});

// Service Worker pour la mise en cache (optionnel)
if ('serviceWorker' in navigator) {
    // Désactiver l'ancien SW qui peut servir des fichiers obsolètes
    navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
    }).catch(() => {});
}
// Fonctions essentielles (sans API)
function getPlaceholderImage() {
    return 'https://images.unsplash.com/photo-1520975922284-7b4e5a3d8f5d?w=400&h=400&fit=crop&auto=format';
}

function getAdPlaceholderImage() {
    return 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&auto=format';
}

function initializeApp() {
    // Réinitialiser le panier à chaque chargement pour éviter le partage entre sessions/tabs
    cart = [];
    try { localStorage.removeItem('ndgCart'); } catch {}
    updateCartUI();
}

function setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeModal = document.getElementById('closeModal');
    const orderForm = document.getElementById('orderForm');
    const contactForm = document.getElementById('contactForm');

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', () => { if (isCartOpen) toggleCart(); });
    if (cartOverlay) cartOverlay.addEventListener('click', () => { if (isCartOpen) toggleCart(); });
    if (checkoutBtn) checkoutBtn.addEventListener('click', openOrderModal);
    if (closeModal) closeModal.addEventListener('click', closeOrderModal);
    if (orderForm) orderForm.addEventListener('submit', handleOrderSubmit);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category || 'all';
            renderProducts();
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let list = products || [];
    if (currentFilter && currentFilter !== 'all') {
        list = list.filter(p => (p.category || '').toLowerCase() === currentFilter.toLowerCase());
    }

    if (!Array.isArray(list) || list.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Aucun produit à afficher.</p>
                <button class="refresh-btn" onclick="reloadData()">Actualiser</button>
            </div>
        `;
        return;
    }

    const html = list.map(p => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${p.image || getPlaceholderImage()}" alt="${p.name}" class="product-image" onerror="this.src='${getPlaceholderImage()}'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-description">${p.description || ''}</p>
                <div class="product-meta">
                    <span class="product-price">${formatPrice(p.price)} DA</span>
                    <button class="add-to-cart-btn" data-id="${p.id}">Ajouter au panier</button>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;

    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            const prod = products.find(x => x.id === id);
            if (prod) addToCart(prod);
        });
    });
}

function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.quantity += 1; else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    updateCartUI();
    saveCart();
    showNotification('Ajouté au panier');
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
    saveCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) return removeFromCart(id);
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const countEl = document.getElementById('cartCount');
    if (!itemsEl || !totalEl || !countEl) return;

    if (!Array.isArray(cart)) cart = [];

    const itemsHtml = cart.map(i => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${i.name}</div>
                <div class="cart-item-price">${formatPrice(i.price)} DA</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" data-action="dec" data-id="${i.id}">-</button>
                <span class="qty">${i.quantity}</span>
                <button class="qty-btn" data-action="inc" data-id="${i.id}">+</button>
                <button class="remove-btn" data-id="${i.id}">×</button>
            </div>
        </div>
    `).join('');

    itemsEl.innerHTML = itemsHtml || '<div class="empty">Panier vide</div>';

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    totalEl.textContent = `${formatPrice(total)} DA`;
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    countEl.textContent = count.toString();

    itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            const action = btn.dataset.action;
            changeQuantity(id, action === 'inc' ? 1 : -1);
        });
    });
    itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            removeFromCart(id);
        });
    });
}

function initializeAds() {
    const titleEl = document.getElementById('adTitle');
    const descEl = document.getElementById('adDescription');
    const imgA = document.getElementById('adImageA');
    const imgB = document.getElementById('adImageB');
    const dots = document.querySelectorAll('#adIndicators .ad-dot');
    if (!titleEl || !descEl || !imgA || !imgB) return;

    let index = 0;
    let showA = true;

    function showAd(i) {
        const ad = ads[i];
        if (!ad) return;
        titleEl.textContent = ad.title || '';
        descEl.textContent = ad.description || '';
        const src = ad.image || getAdPlaceholderImage();
        if (showA) {
            imgA.src = src;
            imgA.classList.add('active');
            imgB.classList.remove('active');
        } else {
            imgB.src = src;
            imgB.classList.add('active');
            imgA.classList.remove('active');
        }
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`#adIndicators .ad-dot[data-ad="${i}"]`);
        if (dot) dot.classList.add('active');
        showA = !showA;
    }

    if (adsInterval) clearInterval(adsInterval);
    if (!Array.isArray(ads) || ads.length === 0) {
        imgA.src = getAdPlaceholderImage();
        imgA.classList.add('active');
        imgB.classList.remove('active');
        titleEl.textContent = '';
        descEl.textContent = '';
        return;
    }
    showAd(index);
    adsInterval = setInterval(() => {
        index = (index + 1) % ads.length;
        showAd(index);
    }, 5000);

    // Navigation par points
    dots.forEach((d) => {
        d.addEventListener('click', () => {
            const target = parseInt(d.getAttribute('data-ad') || '0', 10);
            if (!isNaN(target)) {
                index = target;
                showAd(index);
            }
        });
    });
}
