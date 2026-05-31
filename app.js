/* app.js - Barbershop Platform Core Engine */

// Firebase Configuration & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyB1S_ecYUCzFCiuFG0Gy9mEpzs7ICn4fdw",
  authDomain: "barbershop-280a8.firebaseapp.com",
  projectId: "barbershop-280a8",
  storageBucket: "barbershop-280a8.firebasestorage.app",
  messagingSenderId: "181649406695",
  appId: "1:181649406695:web:3e21b90e6968329d558042",
  measurementId: "G-QR3NCSLMWH"
};

let db = null;
let analytics = null;
let isFirebaseConnected = false;

if (typeof firebase !== "undefined") {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        analytics = firebase.analytics();
        isFirebaseConnected = true;
        console.log("Firebase initialized successfully.");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.warn("Firebase global object is not available. Using LocalStorage fallback mode.");
}

// Default Configuration & Mock Data
const DEFAULT_SERVICES = [
    { id: "srv-1", name: "Classic Haircut", category: "Potong Rambut", price: 45000, duration: 30, desc: "Potong rambut klasik dengan finishing pomade premium dan pijat kepala ringan.", photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=300&auto=format&fit=crop", tag: "Populer" },
    { id: "srv-2", name: "Premium Wash & Cut", category: "Cuci + Potong", price: 65000, duration: 45, desc: "Potong rambut dengan keramas handuk hangat, tonik rambut, dan pijat bahu relaksasi.", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300&auto=format&fit=crop", tag: "Laris" },
    { id: "srv-3", name: "Beard Trim & Shave", category: "Cukur Jenggot", price: 30000, duration: 25, desc: "Cukur kumis/jenggot rapi dengan balutan krim cukur aromaterapi dan hot towel.", photo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=300&auto=format&fit=crop", tag: "" },
    { id: "srv-4", name: "Modern Hair Coloring", category: "Cat Rambut", price: 135000, duration: 90, desc: "Pewarnaan rambut trendi menggunakan produk berkualitas tinggi yang aman untuk kulit kepala.", photo: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop", tag: "Baru" },
    { id: "srv-5", name: "Luxurious Creambath & Mask", category: "Hair Treatment", price: 80000, duration: 50, desc: "Perawatan rambut kering/ketombe dengan masker herbal dan pijat relaksasi mendalam.", photo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=300&auto=format&fit=crop", tag: "Promo" },
    { id: "srv-6", name: "Charcoal Face Mask & Shaving", category: "Wajah", price: 55000, duration: 30, desc: "Masker arang aktif untuk angkat komedo hitam ditambah shaving jenggot bersih.", photo: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=300&auto=format&fit=crop", tag: "" }
];

const DEFAULT_BARBERS = [
    { id: "bbr-1", name: "Rian Ferdinand", spec: "Undercut & Pompadour Expert", rating: 4.9, reviewsCount: 342, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", active: true },
    { id: "bbr-2", name: "Dani Hidayat", spec: "Classic Cut & Flat Top Specialist", rating: 4.8, reviewsCount: 295, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", active: true },
    { id: "bbr-3", name: "Yudi Ardiansyah", spec: "Coloring & Beard Design Specialist", rating: 4.9, reviewsCount: 184, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", active: true },
    { id: "bbr-4", name: "Kiki Rahmawan", spec: "Hair Treatment & Head Message Expert", rating: 4.7, reviewsCount: 112, photo: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?q=80&w=200&auto=format&fit=crop", active: true }
];

const DEFAULT_REVIEWS = [
    { id: "rev-1", name: "Budi Santoso", rating: 5, comment: "Potongan Classic Haircut oleh Mas Rian rapi sekali! Pijat kepalanya bikin rileks banget. Barbershop ternyaman!", date: "2026-05-27" },
    { id: "rev-2", name: "Andi Wijaya", rating: 5, comment: "Dani sangat teliti merapikan janggut saya. Menggunakan hot towel benar-benar berkelas. Sangat direkomendasikan!", date: "2026-05-25" },
    { id: "rev-3", name: "Hendra Lesmana", rating: 4, comment: "Pewarnaan rambutnya bagus, warnanya merata dan tidak gatal di kulit kepala. Sukses terus!", date: "2026-05-24" }
];

const DEFAULT_BOOKINGS = [
    { id: "BKG-260528-01", customerName: "Budi Santoso", customerPhone: "08123456789", customerEmail: "budi@gmail.com", serviceId: "srv-1", barberId: "bbr-1", date: "2026-05-28", time: "10:00", price: 45000, status: "Selesai", codeVoucher: "", pointsEarned: 40, reviewLeft: true, paymentStatus: "Lunas" },
    { id: "BKG-260528-02", customerName: "Andi Wijaya", customerPhone: "08111222333", customerEmail: "andi@gmail.com", serviceId: "srv-3", barberId: "bbr-2", date: "2026-05-28", time: "11:00", price: 30000, status: "Selesai", codeVoucher: "", pointsEarned: 30, reviewLeft: true, paymentStatus: "Lunas" },
    { id: "BKG-260529-03", customerName: "Dedi Kurniawan", customerPhone: "08999888777", customerEmail: "dedi@gmail.com", serviceId: "srv-2", barberId: "bbr-1", date: "2026-05-29", time: "09:00", price: 65000, status: "Sedang Dilayani", codeVoucher: "", pointsEarned: 60, reviewLeft: false, paymentStatus: "Lunas" },
    { id: "BKG-260529-04", customerName: "Ahmad Yani", customerPhone: "08577777777", customerEmail: "ahmad@gmail.com", serviceId: "srv-1", barberId: "bbr-3", date: "2026-05-29", time: "11:30", price: 45000, status: "Dikonfirmasi", codeVoucher: "", pointsEarned: 40, reviewLeft: false, paymentStatus: "Belum Bayar" },
    { id: "BKG-260529-05", customerName: "Rudi Hartono", customerPhone: "08122334455", customerEmail: "rudi@gmail.com", serviceId: "srv-5", barberId: "bbr-4", date: "2026-05-29", time: "13:00", price: 80000, status: "Menunggu", codeVoucher: "", pointsEarned: 80, reviewLeft: false, paymentStatus: "Belum Bayar" }
];

const DEFAULT_WALKINS = [
    { id: "Q-001", customerName: "Walk-in Boni", serviceId: "srv-1", barberId: "bbr-2", status: "Selesai", timeAdded: "08:15" },
    { id: "Q-002", customerName: "Walk-in Anton", serviceId: "srv-2", barberId: "bbr-1", status: "Sedang Dilayani", timeAdded: "08:45" },
    { id: "Q-003", customerName: "Walk-in Cecep", serviceId: "srv-3", barberId: "bbr-3", status: "Menunggu", timeAdded: "09:10" }
];

const VOUCHERS = {
    "BARBERMAJU": 0.15, // 15% discount
    "JUMATBERKAH": 0.20, // 20% discount
    "NEWUSER": 10000 // Rp 10.000 potong langsung
};

// Global Store State
let store = {
    role: "public", // public, customer, admin, tv
    services: [],
    barbers: [],
    reviews: [],
    bookings: [],
    walkins: [],
    activeUser: {
        name: "Ahmad Yani",
        phone: "08577777777",
        email: "ahmad@gmail.com",
        points: 120,
        membership: "Silver",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
    },
    settings: {
        storeName: "Majestic Cuts Barbershop",
        storeAddress: "Jl. Veteran No. 42, Kota Bandung",
        storeOpen: "09:00",
        storeClose: "21:00",
        slotDuration: 30, // in minutes
        whatsappApi: "https://api.whatsapp.com/send?phone=628123456789"
    }
};

// Wizard Form State for Active Booking
let wizardState = {
    step: 1,
    serviceId: null,
    barberId: null,
    date: "",
    time: "",
    note: "",
    voucherCode: "",
    discountAmount: 0,
    totalPrice: 0
};

// Main Initialization Function
window.addEventListener("DOMContentLoaded", () => {
    initDatabase();
    
    // Automatically set active role based on current folder path
    const path = window.location.pathname;
    if (path.includes("/user/")) {
        store.role = "customer";
    } else if (path.includes("/admin/")) {
        store.role = "admin";
    } else if (path.includes("/landingPage/") || path.includes("/public/")) {
        store.role = "public";
    } else {
        store.role = "public";
    }
    saveToLocalStorage();
    
    bindEvents();
    renderView();
    updateUIForCurrentRole();
    
    // Check if we just transitioned role and have a pending success toast
    const toastText = sessionStorage.getItem("role_switched_toast");
    if (toastText) {
        setTimeout(() => {
            showSuccessToast(`Beralih peran ke: <strong>${toastText}</strong>`);
        }, 300);
        sessionStorage.removeItem("role_switched_toast");
    }
});

// Load data from localStorage or fallback to defaults
function initDatabase() {
    if (localStorage.getItem("barbershop_db")) {
        store = JSON.parse(localStorage.getItem("barbershop_db"));
    } else {
        store.services = DEFAULT_SERVICES;
        store.barbers = DEFAULT_BARBERS;
        store.reviews = DEFAULT_REVIEWS;
        store.bookings = DEFAULT_BOOKINGS;
        store.walkins = DEFAULT_WALKINS;
        saveToLocalStorage();
    }
    
    // Default active user initialization if missing
    if (!store.activeUser) {
        store.activeUser = {
            name: "Ahmad Yani",
            phone: "08577777777",
            email: "ahmad@gmail.com",
            points: 120,
            membership: "Silver",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
        };
    }
    
    // Set user membership based on points
    updateUserMembership();

    // Setup real-time Firestore sync
    if (isFirebaseConnected && db) {
        setupFirestoreSync();
    }
}

function setupFirestoreSync() {
    const collections = ["services", "barbers", "reviews", "bookings", "walkins", "settings"];
    
    collections.forEach(colName => {
        db.collection(colName).onSnapshot(snapshot => {
            if (snapshot.empty) {
                console.log(`Firestore collection '${colName}' is empty. Seeding defaults...`);
                seedFirestoreCollection(colName);
                return;
            }
            
            let data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            
            if (colName === "settings") {
                const globalSettings = data.find(d => d.id === "global") || data[0];
                if (globalSettings) {
                    store.settings = globalSettings;
                }
            } else {
                if (colName === "bookings") {
                    data.sort((a, b) => b.id.localeCompare(a.id));
                } else if (colName === "walkins") {
                    data.sort((a, b) => a.id.localeCompare(b.id));
                } else if (colName === "reviews") {
                    data.sort((a, b) => b.id.localeCompare(a.id));
                }
                store[colName] = data;
            }
            
            saveToLocalStorage();
            
            // Re-render display content
            if (typeof renderView === "function") {
                renderView();
            }
            if (store.role === "android-user" && typeof renderAndroidUserScreenContent === "function") {
                renderAndroidUserScreenContent();
            }
            if (store.role === "android-admin" && typeof renderAndroidAdminScreenContent === "function") {
                renderAndroidAdminScreenContent();
            }
        }, error => {
            console.error(`Firestore snapshot error for collection '${colName}':`, error);
        });
    });
}

function seedFirestoreCollection(colName) {
    if (!isFirebaseConnected || !db) return;
    
    let defaultData = [];
    if (colName === "services") defaultData = DEFAULT_SERVICES;
    else if (colName === "barbers") defaultData = DEFAULT_BARBERS;
    else if (colName === "reviews") defaultData = DEFAULT_REVIEWS;
    else if (colName === "bookings") defaultData = DEFAULT_BOOKINGS;
    else if (colName === "walkins") defaultData = DEFAULT_WALKINS;
    else if (colName === "settings") {
        db.collection("settings").doc("global").set(store.settings)
            .then(() => console.log("Seeded default settings successfully."))
            .catch(err => console.error("Error seeding settings:", err));
        return;
    }
    
    defaultData.forEach(item => {
        const itemCopy = { ...item };
        const id = itemCopy.id;
        delete itemCopy.id;
        
        db.collection(colName).doc(id).set(itemCopy)
            .then(() => console.log(`Seeded document in ${colName}: ${id}`))
            .catch(err => console.error(`Error seeding ${colName}/${id}:`, err));
    });
}

function saveToLocalStorage() {
    localStorage.setItem("barbershop_db", JSON.stringify(store));
}

function updateUserMembership() {
    const pts = store.activeUser.points || 0;
    if (pts >= 300) {
        store.activeUser.membership = "Platinum";
    } else if (pts >= 120) {
        store.activeUser.membership = "Gold";
    } else {
        store.activeUser.membership = "Silver";
    }
}

// Global Event Bindings
function bindEvents() {
    // Role switcher logic
    const toggleBtn = document.getElementById("roleSwitcherBtn");
    const roleMenu = document.getElementById("roleMenu");
    
    if (toggleBtn && roleMenu) {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            roleMenu.classList.toggle("active");
        });
        
        document.addEventListener("click", () => {
            roleMenu.classList.remove("active");
        });
    }
    
    const roleOptions = document.querySelectorAll(".role-option");
    roleOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            e.preventDefault();
            const targetRole = opt.getAttribute("data-role");
            switchRole(targetRole);
        });
    });

    // Public Contact Form
    const contactForm = document.getElementById("publicContactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showSuccessToast("Pesan Anda telah terkirim! Terima kasih telah menghubungi kami.");
            contactForm.reset();
        });
    }
    
    // Add Walkin Booking Form (Admin)
    const walkinForm = document.getElementById("adminAddWalkinForm");
    if (walkinForm) {
        walkinForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addWalkinFromAdmin();
        });
    }

    // Save System Settings Form (Admin)
    const settingsForm = document.getElementById("adminSettingsForm");
    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveSystemSettings();
        });
    }

    // Add Barber Form (Admin)
    const addBarberForm = document.getElementById("adminAddBarberForm");
    if (addBarberForm) {
        addBarberForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addBarberFromAdmin();
        });
    }

    // Add Service Form (Admin)
    const addServiceForm = document.getElementById("adminAddServiceForm");
    if (addServiceForm) {
        addServiceForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addServiceFromAdmin();
        });
    }

    // Customer Review Submit
    const reviewForm = document.getElementById("customerReviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitCustomerReview();
        });
    }

    // Profile Edit Submit
    const profileForm = document.getElementById("customerProfileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveCustomerProfile();
        });
    }
}

// Role Switcher Mechanics
function switchRole(newRole) {
    store.role = newRole;
    saveToLocalStorage();
    updateUIForCurrentRole();
    
    // Determine the path prefix dynamically depending on current page URL
    const currentPath = window.location.pathname;
    let pathPrefix = "../";
    
    if (!currentPath.includes("/landingPage/") && 
        !currentPath.includes("/user/") && 
        !currentPath.includes("/admin/") && 
        !currentPath.includes("/assets/www/")) {
        pathPrefix = "./";
    }
    
    // Handle page redirection based on role
    const pageMap = {
        "public": pathPrefix + "landingPage/index.html",
        "customer": pathPrefix + "user/index.html",
        "admin": pathPrefix + "admin/index.html",
        "android-user": pathPrefix + "android-user/app/src/main/assets/www/index.html",
        "android-admin": pathPrefix + "android-admin/app/src/main/assets/www/index.html"
    };
    
    const targetPage = pageMap[newRole] || (pathPrefix + "landingPage/index.html");
    
    let roleText = "Halaman Publik";
    if (newRole === "customer") roleText = "Portal Pelanggan (Web)";
    if (newRole === "admin") roleText = "Panel Admin Barbershop (Web)";
    if (newRole === "android-user") roleText = "Aplikasi Pelanggan Android";
    if (newRole === "android-admin") roleText = "Aplikasi Admin Android";
    
    // Store message in sessionStorage to display on next page
    sessionStorage.setItem("role_switched_toast", roleText);
    window.location.href = targetPage;
}

function updateUIForCurrentRole() {
    const roleOptions = document.querySelectorAll(".role-option");
    roleOptions.forEach(opt => {
        if (opt.getAttribute("data-role") === store.role) {
            opt.classList.add("selected");
        } else {
            opt.classList.remove("selected");
        }
    });
    
    // Sync Master Control Bar button classes
    const buttons = document.querySelectorAll("#masterDemoHubButtons .btn");
    buttons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.id === `btnHub-${store.role}`) {
            btn.classList.add("active");
        }
    });
}

// Views Render router based on state.role
function renderView() {
    // Hide all main containers
    const publicLayout = document.getElementById("publicLayout");
    const customerLayout = document.getElementById("customerLayout");
    const adminLayout = document.getElementById("adminLayout");
    
    if (publicLayout) publicLayout.classList.add("d-none");
    if (customerLayout) customerLayout.classList.add("d-none");
    if (adminLayout) adminLayout.classList.add("d-none");
    
    const path = window.location.pathname;
    
    if (path.includes("/landingPage/") || path.includes("/public/") || store.role === "public") {
        if (publicLayout) publicLayout.classList.remove("d-none");
        renderPublicPages();
    } else if (path.includes("/user/") || store.role === "customer") {
        if (customerLayout) customerLayout.classList.remove("d-none");
        renderCustomerPortal();
    } else if (path.includes("/admin/") || store.role === "admin") {
        if (adminLayout) adminLayout.classList.remove("d-none");
        renderAdminPanel();
    }
}

// -------------------------------------------
// 1. PUBLIC LAYOUT VIEWS RENDERING
// -------------------------------------------
function renderPublicPages() {
    // Render Services Grid (Public)
    const servicesGrid = document.getElementById("publicServicesGrid");
    if (servicesGrid) {
        servicesGrid.innerHTML = store.services.map(srv => `
            <div class="col-md-4 mb-4">
                <div class="card premium-card h-100">
                    <img src="${srv.photo}" class="card-img-top" alt="${srv.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0" style="color: var(--dark-bg);">${srv.name}</h5>
                            ${srv.tag ? `<span class="badge bg-warning text-dark font-monospace">${srv.tag}</span>` : ''}
                        </div>
                        <p class="text-muted small mb-3">${srv.desc}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="fs-5 fw-bold text-amber-700" style="color: var(--primary);">Rp ${srv.price.toLocaleString('id-ID')}</span>
                            <span class="text-secondary small"><i class="far fa-clock me-1"></i>${srv.duration} Mins</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render Barbers Team (Public)
    const barbersGrid = document.getElementById("publicBarbersGrid");
    if (barbersGrid) {
        barbersGrid.innerHTML = store.barbers.filter(bbr => bbr.active).map(bbr => `
            <div class="col-md-3 mb-4 text-center">
                <div class="card premium-card p-4">
                    <img src="${bbr.photo}" class="rounded-circle mx-auto mb-3" alt="${bbr.name}" style="width: 110px; height: 110px; object-fit: cover; border: 4px solid var(--primary-light);">
                    <h5 class="mb-1">${bbr.name}</h5>
                    <p class="text-amber-600 small mb-2" style="color: var(--primary); font-weight: 500;">${bbr.spec}</p>
                    <div class="d-flex justify-content-center align-items-center text-warning small mb-3">
                        <i class="fas fa-star me-1"></i>
                        <span class="fw-bold text-dark me-1">${bbr.rating.toFixed(1)}</span>
                        <span class="text-muted">(${bbr.reviewsCount})</span>
                    </div>
                    <button class="btn btn-gold btn-sm w-100" onclick="switchRole('customer'); startBookingFlow('${bbr.id}')">
                        Pilih Barber ini
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render Testimonials Carousel (Public)
    const testimonialsSlider = document.getElementById("publicTestimonialsSlider");
    if (testimonialsSlider) {
        testimonialsSlider.innerHTML = store.reviews.map((rev, idx) => `
            <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="testimonial-card text-center">
                            <div class="text-warning mb-3">
                                ${Array(rev.rating).fill('<i class="fas fa-star"></i>').join('')}
                                ${Array(5 - rev.rating).fill('<i class="far fa-star"></i>').join('')}
                            </div>
                            <p class="fs-5 text-muted mb-4 font-italic">"${rev.comment}"</p>
                            <h6 class="mb-0 fw-bold" style="color: var(--dark-bg);">${rev.name}</h6>
                            <small class="text-secondary">${rev.date}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Render Hair Style Gallery
    filterGallery('semua');
}

// -------------------------------------------
// 2. CUSTOMER PORTAL VIEWS RENDERING
// -------------------------------------------
function renderCustomerPortal() {
    // Update Greeting Name and Loyalty Points
    document.getElementById("custNavName").innerText = store.activeUser.name;
    document.getElementById("custDashboardWelcome").innerText = `Selamat Datang kembali, ${store.activeUser.name}!`;
    document.getElementById("custPointsDisplay").innerText = `${store.activeUser.points} Poin`;
    document.getElementById("custMembershipDisplay").innerText = `Membership: ${store.activeUser.membership}`;
    
    // Update Progress Bar to Next Level
    const pts = store.activeUser.points || 0;
    let nextLevel = "Gold";
    let targetPts = 120;
    let percent = 0;
    
    if (pts >= 300) {
        nextLevel = "Maksimal (Platinum)";
        targetPts = 300;
        percent = 100;
    } else if (pts >= 120) {
        nextLevel = "Platinum";
        targetPts = 300;
        percent = ((pts - 120) / (300 - 120)) * 100;
    } else {
        nextLevel = "Gold";
        targetPts = 120;
        percent = (pts / 120) * 100;
    }
    
    document.getElementById("custLoyaltyBar").style.width = `${percent}%`;
    document.getElementById("custLoyaltyProgressText").innerText = `${pts} / ${targetPts} Poin menuju level ${nextLevel}`;

    // Render Portal Pages based on internal navigation clicks
    renderCustomerActiveSection("cust-dashboard");
}

function showCustomerSection(sectionId) {
    // Hide all customer sections
    document.querySelectorAll(".cust-section").forEach(sec => sec.classList.add("d-none"));
    document.getElementById(sectionId).classList.remove("d-none");
    
    // Update active nav state
    document.querySelectorAll(".cust-nav-link").forEach(link => {
        if (link.getAttribute("data-target") === sectionId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    renderCustomerActiveSection(sectionId);
}

function renderCustomerActiveSection(sectionId) {
    if (sectionId === "cust-dashboard") {
        renderCustomerDashboard();
    } else if (sectionId === "cust-booking") {
        initBookingWizard();
    } else if (sectionId === "cust-antrean") {
        renderCustomerQueueTracker();
    } else if (sectionId === "cust-riwayat") {
        renderCustomerHistory();
    } else if (sectionId === "cust-reward") {
        renderCustomerRewards();
    } else if (sectionId === "cust-profil") {
        renderCustomerProfileTab();
    }
}

function renderCustomerDashboard() {
    // Check if there is any active booking
    const activeBooking = store.bookings.find(
        b => b.customerEmail === store.activeUser.email && (b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
    );
    
    const statusContainer = document.getElementById("custActiveBookingStatusCard");
    if (!activeBooking) {
        statusContainer.innerHTML = `
            <div class="card premium-card p-4 text-center">
                <i class="far fa-calendar-check text-muted fs-1 mb-3"></i>
                <h5 class="mb-2">Tidak ada booking aktif</h5>
                <p class="text-muted small">Anda belum melakukan booking layanan saat ini. Tekan tombol di bawah untuk membuat reservasi baru!</p>
                <button class="btn btn-gold w-50 mx-auto mt-2" onclick="showCustomerSection('cust-booking')">Booking Sekarang</button>
            </div>
        `;
    } else {
        const srv = store.services.find(s => s.id === activeBooking.serviceId);
        const bbr = store.barbers.find(b => b.id === activeBooking.barberId);
        let badgeColor = "bg-warning text-dark";
        if (activeBooking.status === "Dikonfirmasi") badgeColor = "bg-info text-white";
        if (activeBooking.status === "Sedang Dilayani") badgeColor = "bg-primary text-white";
        
        statusContainer.innerHTML = `
            <div class="card premium-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-bold text-dark font-monospace">${activeBooking.id}</span>
                    <span class="badge ${badgeColor} py-2 px-3">${activeBooking.status}</span>
                </div>
                <h4 class="mb-1" style="color: var(--dark-bg);">${srv.name}</h4>
                <p class="mb-3 text-secondary"><i class="fas fa-user-tie me-2 text-warning"></i>Barber: <strong>${bbr.name}</strong></p>
                
                <div class="row bg-light rounded p-3 mb-3 text-center g-2">
                    <div class="col-6 border-end">
                        <small class="text-muted d-block">Tanggal Booking</small>
                        <strong class="text-dark">${activeBooking.date}</strong>
                    </div>
                    <div class="col-6">
                        <small class="text-muted d-block">Slot Waktu</small>
                        <strong class="text-dark">${activeBooking.time} WIB</strong>
                    </div>
                </div>
                
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking('${activeBooking.id}')">Batalkan</button>
                    <button class="btn btn-gold btn-sm flex-fill" onclick="showCustomerSection('cust-antrean')">Pantau Antrean Live</button>
                </div>
            </div>
        `;
    }
}

// Interactive Booking Wizard Mechanics
function startBookingFlow(preselectedBarberId) {
    showCustomerSection("cust-booking");
    if (preselectedBarberId) {
        wizardState.barberId = preselectedBarberId;
        // Skip straight to next step in background when a barber was chosen directly
        wizardState.step = 1;
        initBookingWizard();
    }
}

function initBookingWizard() {
    renderWizardStepIndicator();
    
    // Render Step Content
    const stepContent = document.getElementById("wizardStepContent");
    const prevBtn = document.getElementById("wizardPrevBtn");
    const nextBtn = document.getElementById("wizardNextBtn");
    
    prevBtn.classList.toggle("d-none", wizardState.step === 1);
    
    if (wizardState.step === 1) {
        // STEP 1: SELECT SERVICE
        nextBtn.innerHTML = 'Lanjut <i class="fas fa-chevron-right ms-1"></i>';
        nextBtn.disabled = !wizardState.serviceId;
        
        stepContent.innerHTML = `
            <h4 class="mb-4 display-font">Pilih Layanan Terbaik</h4>
            <div class="row">
                ${store.services.map(srv => {
                    const isSelected = wizardState.serviceId === srv.id;
                    return `
                        <div class="col-md-6 mb-3">
                            <div class="card premium-card h-100 p-2 cursor-pointer ${isSelected ? 'border-primary bg-light-gold' : ''}" 
                                 onclick="selectWizardService('${srv.id}')"
                                 style="border: 2px solid ${isSelected ? 'var(--primary)' : 'transparent'}; cursor:pointer;">
                                <div class="d-flex align-items-center">
                                    <img src="${srv.photo}" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
                                    <div class="flex-fill">
                                        <h5 class="mb-1 text-dark">${srv.name}</h5>
                                        <p class="text-muted small mb-1 line-clamp-2" style="font-size:0.75rem;">${srv.desc}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="fw-bold text-amber-700" style="color: var(--primary);">Rp ${srv.price.toLocaleString('id-ID')}</span>
                                            <small class="text-secondary"><i class="far fa-clock me-1"></i>${srv.duration} menit</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (wizardState.step === 2) {
        // STEP 2: SELECT BARBER
        nextBtn.disabled = !wizardState.barberId;
        
        stepContent.innerHTML = `
            <h4 class="mb-4 display-font">Pilih Barber / Stylist Anda</h4>
            <div class="row">
                ${store.barbers.filter(bbr => bbr.active).map(bbr => {
                    const isSelected = wizardState.barberId === bbr.id;
                    return `
                        <div class="col-md-6 mb-3">
                            <div class="card premium-card p-3 cursor-pointer ${isSelected ? 'border-primary bg-light-gold' : ''}"
                                 onclick="selectWizardBarber('${bbr.id}')"
                                 style="border: 2px solid ${isSelected ? 'var(--primary)' : 'transparent'}; cursor:pointer;">
                                <div class="d-flex align-items-center">
                                    <img src="${bbr.photo}" class="rounded-circle me-3" style="width: 65px; height: 65px; object-fit: cover; border: 2px solid var(--primary-light);">
                                    <div class="flex-fill">
                                        <h5 class="mb-1 text-dark">${bbr.name}</h5>
                                        <small class="text-muted d-block mb-1">${bbr.spec}</small>
                                        <div class="text-warning small">
                                            <i class="fas fa-star me-1"></i>
                                            <span class="text-dark fw-bold">${bbr.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (wizardState.step === 3) {
        // STEP 3: DATE & TIME
        nextBtn.disabled = !(wizardState.date && wizardState.time);
        
        // Setup Date Input bounds (Today -> +7 Days)
        const todayStr = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const maxDateStr = nextWeek.toISOString().split('T')[0];
        
        stepContent.innerHTML = `
            <h4 class="mb-4 display-font">Pilih Jadwal Kedatangan</h4>
            <div class="row">
                <div class="col-md-5 mb-3">
                    <label class="form-label fw-bold">Pilih Tanggal</label>
                    <input type="date" class="form-control form-control-lg" id="wizardDateInput" 
                           min="${todayStr}" max="${maxDateStr}" 
                           value="${wizardState.date}"
                           onchange="selectWizardDate(this.value)">
                </div>
                <div class="col-md-7 mb-3">
                    <label class="form-label fw-bold">Pilih Jam Tersedia</label>
                    ${wizardState.date ? `
                        <div class="time-slot-grid" id="wizardTimeSlotsContainer">
                            <!-- Injected Slots -->
                        </div>
                    ` : `
                        <div class="alert alert-warning py-3 text-center">
                            <i class="fas fa-calendar-alt me-2"></i> Silakan pilih tanggal terlebih dahulu untuk melihat jam.
                        </div>
                    `}
                </div>
            </div>
        `;
        
        if (wizardState.date) {
            renderWizardTimeSlots();
        }
    } else if (wizardState.step === 4) {
        // STEP 4: REVIEW & CONFIRM
        nextBtn.innerHTML = 'Konfirmasi Booking <i class="fas fa-check-circle ms-1"></i>';
        nextBtn.disabled = false;
        
        const srv = store.services.find(s => s.id === wizardState.serviceId);
        const bbr = store.barbers.find(b => b.id === wizardState.barberId);
        
        wizardState.totalPrice = srv.price - wizardState.discountAmount;
        
        stepContent.innerHTML = `
            <h4 class="mb-4 display-font">Tinjau & Konfirmasi Booking</h4>
            <div class="row">
                <div class="col-md-7">
                    <div class="card bg-light border-0 p-4 rounded mb-3">
                        <h5 class="border-bottom pb-2 mb-3">Rincian Reservasi</h5>
                        <div class="row mb-2">
                            <div class="col-5 text-muted">Layanan:</div>
                            <div class="col-7 fw-bold text-dark">${srv.name} (${srv.duration} Mins)</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-5 text-muted">Barber / Stylist:</div>
                            <div class="col-7 fw-bold text-dark">${bbr.name}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-5 text-muted">Jadwal:</div>
                            <div class="col-7 fw-bold text-dark">${wizardState.date} @ ${wizardState.time} WIB</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-5 text-muted">Catatan Khusus:</div>
                            <div class="col-7">
                                <textarea class="form-control form-control-sm" placeholder="Contoh: Potong bagian samping tipis, fade..." 
                                          onchange="wizardState.note = this.value">${wizardState.note}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card premium-card p-4 border border-warning" style="background-color: #FFFDF9;">
                        <h5 class="mb-3">Kupon & Pembayaran</h5>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Kode Promo" id="promoCodeInput" value="${wizardState.voucherCode}">
                            <button class="btn btn-dark" type="button" onclick="applyPromoCode()">Pakai</button>
                        </div>
                        
                        <div id="promoFeedbackContainer"></div>
                        
                        <div class="border-top pt-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Harga Layanan</span>
                                <strong>Rp ${srv.price.toLocaleString('id-ID')}</strong>
                            </div>
                            ${wizardState.discountAmount > 0 ? `
                                <div class="d-flex justify-content-between text-success mb-2">
                                    <span>Potongan Diskon</span>
                                    <strong>- Rp ${wizardState.discountAmount.toLocaleString('id-ID')}</strong>
                                </div>
                            ` : ''}
                            <hr>
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <span class="fs-5 fw-bold">Total Bayar</span>
                                <strong class="fs-4 text-warning" style="color: var(--primary) !important;">Rp ${wizardState.totalPrice.toLocaleString('id-ID')}</strong>
                            </div>
                            
                            <label class="form-label fw-bold d-block mb-2">Metode Pembayaran</label>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="paymentMethod" id="payCash" checked>
                                <label class="form-check-label" for="payCash">Bayar di Tempat (Cash / QRIS)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function renderWizardStepIndicator() {
    const steps = [
        { num: 1, label: "Layanan" },
        { num: 2, label: "Barber" },
        { num: 3, label: "Jadwal" },
        { num: 4, label: "Konfirmasi" }
    ];
    
    const indicator = document.getElementById("wizardStepIndicator");
    indicator.innerHTML = steps.map(s => {
        let statusClass = "";
        if (wizardState.step === s.num) statusClass = "active";
        else if (wizardState.step > s.num) statusClass = "completed";
        
        return `
            <div class="wizard-step ${statusClass}">
                <div class="wizard-step-circle">
                    ${wizardState.step > s.num ? '<i class="fas fa-check"></i>' : s.num}
                </div>
                <div class="wizard-step-label">${s.label}</div>
            </div>
        `;
    }).join('');
}

function selectWizardService(srvId) {
    wizardState.serviceId = srvId;
    initBookingWizard();
}

function selectWizardBarber(bbrId) {
    wizardState.barberId = bbrId;
    initBookingWizard();
}

function selectWizardDate(dateVal) {
    wizardState.date = dateVal;
    wizardState.time = ""; // reset time when date changes
    initBookingWizard();
}

function renderWizardTimeSlots() {
    const slotsContainer = document.getElementById("wizardTimeSlotsContainer");
    if (!slotsContainer) return;
    
    const startHour = 9;
    const endHour = 20;
    const interval = 30; // mins
    
    let html = "";
    
    // Find already booked slots for the chosen barber & date
    const bookedTimes = store.bookings
        .filter(b => b.barberId === wizardState.barberId && b.date === wizardState.date && b.status !== "Dibatalkan")
        .map(b => b.time);
    
    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += interval) {
            if (h === endHour && m > 0) break;
            
            const hStr = h.toString().padStart(2, '0');
            const mStr = m.toString().padStart(2, '0');
            const timeStr = `${hStr}:${mStr}`;
            
            const isBooked = bookedTimes.includes(timeStr);
            const isSelected = wizardState.time === timeStr;
            
            html += `
                <div class="time-slot-btn ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                     onclick="${isBooked ? '' : `selectWizardTime('${timeStr}')`}">
                    ${timeStr}
                </div>
            `;
        }
    }
    
    slotsContainer.innerHTML = html;
}

function selectWizardTime(timeVal) {
    wizardState.time = timeVal;
    initBookingWizard();
}

function applyPromoCode() {
    const promoInput = document.getElementById("promoCodeInput");
    const fb = document.getElementById("promoFeedbackContainer");
    if (!promoInput || !fb) return;
    
    const code = promoInput.value.toUpperCase().trim();
    const srv = store.services.find(s => s.id === wizardState.serviceId);
    
    if (VOUCHERS[code] !== undefined) {
        wizardState.voucherCode = code;
        const discountFactor = VOUCHERS[code];
        
        if (discountFactor < 1) {
            wizardState.discountAmount = Math.round(srv.price * discountFactor);
            fb.innerHTML = `<div class="text-success small mb-2"><i class="fas fa-check-circle me-1"></i> Voucher berhasil diterapkan: Potongan ${discountFactor * 100}%!</div>`;
        } else {
            wizardState.discountAmount = discountFactor;
            fb.innerHTML = `<div class="text-success small mb-2"><i class="fas fa-check-circle me-1"></i> Voucher berhasil diterapkan: Potongan Rp ${discountFactor.toLocaleString('id-ID')}!</div>`;
        }
        initBookingWizard();
    } else {
        fb.innerHTML = `<div class="text-danger small mb-2"><i class="fas fa-times-circle me-1"></i> Voucher tidak valid atau kedaluwarsa.</div>`;
        wizardState.voucherCode = "";
        wizardState.discountAmount = 0;
    }
}

// Wizard Next & Back controls
function wizardNext() {
    if (wizardState.step < 4) {
        wizardState.step++;
        initBookingWizard();
    } else {
        submitWizardBooking();
    }
}

function wizardPrev() {
    if (wizardState.step > 1) {
        wizardState.step--;
        initBookingWizard();
    }
}

function submitWizardBooking() {
    // Generate Booking ID: BKG-YYMMDD-RAND
    const dStr = wizardState.date.replace(/-/g, '').slice(2);
    const rand = Math.floor(100 + Math.random() * 900);
    const bookingId = `BKG-${dStr}-${rand}`;
    
    const newBooking = {
        id: bookingId,
        customerName: store.activeUser.name,
        customerPhone: store.activeUser.phone,
        customerEmail: store.activeUser.email,
        serviceId: wizardState.serviceId,
        barberId: wizardState.barberId,
        date: wizardState.date,
        time: wizardState.time,
        price: wizardState.totalPrice,
        status: "Menunggu",
        codeVoucher: wizardState.voucherCode,
        pointsEarned: Math.round(wizardState.totalPrice / 1000), // 1 point per Rp 1.000 spent
        reviewLeft: false,
        note: wizardState.note
    };
    
    store.bookings.unshift(newBooking);
    
    // Add points to customer active account immediately
    store.activeUser.points += newBooking.pointsEarned;
    updateUserMembership();
    
    saveToLocalStorage();
    
    // Sync to Firestore
    if (isFirebaseConnected && db) {
        const dbBooking = { ...newBooking };
        delete dbBooking.id;
        db.collection("bookings").doc(bookingId).set(dbBooking)
            .catch(err => console.error("Firestore booking write error:", err));
    }
    
    // Show success dialog
    const modalDiv = document.getElementById("bookingSuccessModal");
    if (modalDiv) {
        document.getElementById("successBookingId").innerText = bookingId;
        const modal = new bootstrap.Modal(modalDiv);
        modal.show();
    }
    
    // Reset booking state
    wizardState = { step: 1, serviceId: null, barberId: null, date: "", time: "", note: "", voucherCode: "", discountAmount: 0, totalPrice: 0 };
    
    // Route to dashboard
    showCustomerSection("cust-dashboard");
}

function cancelBooking(bookingId) {
    if (confirm(`Apakah Anda yakin ingin membatalkan booking ${bookingId}?`)) {
        const b = store.bookings.find(x => x.id === bookingId);
        if (b) {
            b.status = "Dibatalkan";
            // Deduct points earned
            store.activeUser.points = Math.max(0, store.activeUser.points - b.pointsEarned);
            updateUserMembership();
            saveToLocalStorage();
            showSuccessToast(`Booking ${bookingId} berhasil dibatalkan.`);
            renderCustomerActiveSection("cust-dashboard");
        }
    }
}

// Queue Status Tracker Screen
function renderCustomerQueueTracker() {
    const queueCard = document.getElementById("custLiveQueueCard");
    
    // Find active booking for current user
    const activeBooking = store.bookings.find(
        b => b.customerEmail === store.activeUser.email && (b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
    );
    
    if (!activeBooking) {
        queueCard.innerHTML = `
            <div class="alert alert-info py-4 text-center">
                <i class="fas fa-info-circle me-2 fs-4"></i> Anda belum memiliki jadwal antrean aktif saat ini.
            </div>
        `;
        return;
    }
    
    // Generate simulated Queue details
    // Find active queues on Admin screen
    const allActiveQueues = [
        ...store.bookings.filter(b => b.date === activeBooking.date && (b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")),
        ...store.walkins.filter(w => w.status === "Menunggu" || w.status === "Sedang Dilayani")
    ];
    
    // Sort so "Sedang Dilayani" comes first, then sorted by time
    allActiveQueues.sort((x, y) => {
        if (x.status === "Sedang Dilayani" && y.status !== "Sedang Dilayani") return -1;
        if (x.status !== "Sedang Dilayani" && y.status === "Sedang Dilayani") return 1;
        return 0;
    });

    const myPosition = allActiveQueues.findIndex(q => q.id === activeBooking.id);
    const peopleAhead = myPosition > 0 ? myPosition : 0;
    const estWaitTime = peopleAhead * 25; // 25 mins per person estimate
    
    const curServing = allActiveQueues.find(q => q.status === "Sedang Dilayani");
    const curServingName = curServing ? curServing.customerName : "Belum ada";
    
    queueCard.innerHTML = `
        <div class="text-center p-3 animate-slide">
            <span class="badge bg-danger mb-3 py-2 px-3"><span class="live-dot"></span>LIVE MONITORING</span>
            
            <div class="mb-4">
                <h6 class="text-muted text-uppercase mb-1">Nomor Antrean Anda</h6>
                <div class="display-1 fw-bold text-amber-700" style="color: var(--primary); font-size: 5rem;">
                    ${activeBooking.time}
                </div>
                <small class="text-secondary">Berdasarkan Jam Kedatangan</small>
            </div>
            
            <div class="row justify-content-center mb-4">
                <div class="col-md-8">
                    <div class="card border-0 bg-light p-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Status:</span>
                            <span class="fw-bold text-uppercase">${activeBooking.status}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Sedang Dilayani:</span>
                            <span class="fw-bold text-dark">${curServingName}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Jumlah Antrean di Depan:</span>
                            <span class="fw-bold text-dark">${peopleAhead} Orang</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted">Estimasi Waktu Tunggu:</span>
                            <span class="fw-bold text-warning" style="color: var(--primary);">${estWaitTime} Menit</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="progress mb-4" style="height: 10px; border-radius:50px;">
                <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" 
                     style="width: ${myPosition === 0 ? '100' : Math.max(15, 100 - (peopleAhead * 20))}%"></div>
            </div>
            
            <p class="small text-muted"><i class="fas fa-exclamation-circle me-1"></i> Mohon hadir di barbershop paling lambat 10 menit sebelum jadwal reservasi Anda.</p>
        </div>
    `;
}

// User History Page
function renderCustomerHistory() {
    const historyContainer = document.getElementById("custHistoryContainer");
    const userBookings = store.bookings.filter(b => b.customerEmail === store.activeUser.email);
    
    if (userBookings.length === 0) {
        historyContainer.innerHTML = `
            <div class="alert alert-secondary text-center py-4">
                <i class="far fa-folder-open me-2 fs-4"></i> Riwayat booking Anda masih kosong.
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = userBookings.map(b => {
        const srv = store.services.find(s => s.id === b.serviceId);
        const bbr = store.barbers.find(x => x.id === b.barberId);
        
        let badgeColor = "bg-warning text-dark";
        if (b.status === "Dikonfirmasi") badgeColor = "bg-info text-white";
        if (b.status === "Sedang Dilayani") badgeColor = "bg-primary text-white";
        if (b.status === "Selesai") badgeColor = "bg-success text-white";
        if (b.status === "Dibatalkan") badgeColor = "bg-danger text-white";
        
        // Dynamic payment badges & actions
        let paymentBadge = "";
        let paymentAction = "";
        
        if (b.status !== "Dibatalkan") {
            if (b.paymentStatus === "Lunas") {
                paymentBadge = `<span class="badge bg-success-subtle text-success border border-success ms-2 font-monospace small" style="font-size:0.65rem;">LUNAS</span>`;
            } else if (b.paymentStatus === "Menunggu Konfirmasi") {
                paymentBadge = `<span class="badge bg-secondary ms-2 font-monospace small" style="font-size:0.65rem;"><i class="fas fa-spinner fa-spin me-1"></i>VERIFIKASI BAYAR</span>`;
            } else if (b.status !== "Selesai") {
                paymentBadge = `<span class="badge bg-warning-subtle text-warning border border-warning ms-2 font-monospace small" style="font-size:0.65rem;">BELUM LUNAS</span>`;
                paymentAction = `<button class="btn btn-sm btn-info text-white me-1" onclick="openPaymentModal('${b.id}')"><i class="fas fa-upload me-1"></i>Bayar Transfer</button>`;
            }
        }
        
        return `
            <div class="card premium-card mb-3 p-3 animate-slide">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-2">
                    <div>
                        <span class="fw-bold font-monospace text-dark me-1">${b.id}</span>
                        <small class="text-secondary">${b.date} @ ${b.time}</small>
                        ${paymentBadge}
                    </div>
                    <span class="badge ${badgeColor}">${b.status}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-1">${srv.name}</h6>
                        <small class="text-muted"><i class="fas fa-user-tie me-1"></i>Barber: <strong>${bbr.name}</strong></small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-dark mb-1">Rp ${b.price.toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <div class="d-flex justify-content-end border-top pt-2">
                    <button class="btn btn-sm btn-outline-gold me-1" onclick="openInvoiceModal('${b.id}')"><i class="fas fa-print me-1"></i>Struk</button>
                    ${paymentAction}
                    ${b.status === "Selesai" && !b.reviewLeft ? `
                        <button class="btn btn-warning btn-sm" onclick="openReviewModal('${b.id}')"><i class="far fa-star me-1"></i>Beri Ulasan</button>
                    ` : ''}
                    ${b.status === "Selesai" && b.reviewLeft ? `
                        <span class="badge bg-light text-secondary border d-flex align-items-center"><i class="fas fa-check-double me-1 text-success"></i> Sudah Diulas</span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Review Popup Control
let activeBookingIdForReview = "";
function openReviewModal(bkgId) {
    activeBookingIdForReview = bkgId;
    const modalDiv = document.getElementById("addReviewModal");
    if (modalDiv) {
        const modal = new bootstrap.Modal(modalDiv);
        modal.show();
    }
}

function submitCustomerReview() {
    const ratingInput = document.querySelector('input[name="ratingStar"]:checked');
    const commentInput = document.getElementById("reviewComment");
    
    if (!ratingInput) {
        alert("Mohon pilih rating bintang!");
        return;
    }
    
    const ratingVal = parseInt(ratingInput.value);
    const commentVal = commentInput.value.trim() || "Potongan sangat rapi dan memuaskan!";
    
    // Add to Reviews Database
    const newReview = {
        id: `rev-${Date.now()}`,
        name: store.activeUser.name,
        rating: ratingVal,
        comment: commentVal,
        date: new Date().toISOString().split('T')[0]
    };
    
    store.reviews.unshift(newReview);
    
    // Set booking review flag
    const bkg = store.bookings.find(b => b.id === activeBookingIdForReview);
    if (bkg) {
        bkg.reviewLeft = true;
        
        // Update barber ratings average dynamically
        const bbr = store.barbers.find(bar => bar.id === bkg.barberId);
        if (bbr) {
            const currentTotalStars = bbr.rating * bbr.reviewsCount;
            bbr.reviewsCount++;
            bbr.rating = (currentTotalStars + ratingVal) / bbr.reviewsCount;
            
            // Sync barber rating to Firestore
            if (isFirebaseConnected && db) {
                const dbBbr = { ...bbr };
                delete dbBbr.id;
                db.collection("barbers").doc(bbr.id).set(dbBbr)
                    .catch(err => console.error("Firestore barber write error:", err));
            }
        }
        
        // Sync updated booking to Firestore
        if (isFirebaseConnected && db) {
            const dbBkg = { ...bkg };
            delete dbBkg.id;
            db.collection("bookings").doc(bkg.id).set(dbBkg)
                .catch(err => console.error("Firestore booking review flag error:", err));
        }
    }
    
    saveToLocalStorage();
    
    // Sync review to Firestore
    if (isFirebaseConnected && db) {
        const dbRev = { ...newReview };
        delete dbRev.id;
        db.collection("reviews").doc(newReview.id).set(dbRev)
            .catch(err => console.error("Firestore review write error:", err));
    }
    
    // Hide Modal
    const modalEl = document.getElementById("addReviewModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    // Reset Form
    document.getElementById("customerReviewForm").reset();
    
    showSuccessToast("Terima kasih atas ulasan berharga Anda!");
    renderCustomerActiveSection("cust-riwayat");
}

// Rewards and Membership Card Panel
function renderCustomerRewards() {
    const memberCard = document.getElementById("custDigitalMemberCard");
    const currentPoints = store.activeUser.points || 0;
    const tier = store.activeUser.membership.toLowerCase();
    
    memberCard.className = `member-digital-card ${tier}`;
    memberCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h5 class="mb-0 fw-bold font-monospace text-uppercase" style="letter-spacing:1px;">BARBER MEMBER</h5>
                <span class="badge bg-white text-dark small py-1 px-2 mt-1" style="font-weight:700;">${store.activeUser.membership}</span>
            </div>
            <div class="member-card-chip"></div>
        </div>
        
        <div class="my-3">
            <small class="d-block text-white-50 small">Nama Lengkap</small>
            <h5 class="mb-0 fw-bold">${store.activeUser.name}</h5>
        </div>
        
        <div class="d-flex justify-content-between align-items-end border-top pt-2" style="border-color: rgba(255,255,255,0.15) !important;">
            <div>
                <small class="d-block text-white-50 small">Sisa Reward Poin</small>
                <h4 class="mb-0 fw-bold font-monospace">${currentPoints} PTS</h4>
            </div>
            <small class="font-monospace text-white-50">EST. 2026</small>
        </div>
    `;
}

// Customer Profile Section
function renderCustomerProfileTab() {
    document.getElementById("profileNameInput").value = store.activeUser.name;
    document.getElementById("profilePhoneInput").value = store.activeUser.phone;
    document.getElementById("profileEmailInput").value = store.activeUser.email;
}

function saveCustomerProfile() {
    const n = document.getElementById("profileNameInput").value.trim();
    const p = document.getElementById("profilePhoneInput").value.trim();
    const e = document.getElementById("profileEmailInput").value.trim();
    
    if (!n || !p || !e) {
        alert("Semua kolom harus diisi!");
        return;
    }
    
    store.activeUser.name = n;
    store.activeUser.phone = p;
    store.activeUser.email = e;
    
    saveToLocalStorage();
    showSuccessToast("Profil berhasil diperbarui!");
    renderCustomerPortal();
}


// -------------------------------------------
// 3. ADMIN PANEL VIEWS RENDERING
// -------------------------------------------
let salesChart = null;
let barberChart = null;

function renderAdminPanel() {
    // Nav links binding
    const adminLinks = document.querySelectorAll(".admin-nav-link");
    adminLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetSec = link.getAttribute("data-target");
            
            // Show active section
            document.querySelectorAll(".admin-section").forEach(s => s.classList.add("d-none"));
            document.getElementById(targetSec).classList.remove("d-none");
            
            // Update active state
            adminLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            
            renderAdminActiveSection(targetSec);
        });
    });

    renderAdminActiveSection("admin-dashboard");
}

function renderAdminActiveSection(sectionId) {
    if (sectionId === "admin-dashboard") {
        renderAdminDashboard();
    } else if (sectionId === "admin-booking") {
        renderAdminBookingList();
    } else if (sectionId === "admin-antrean") {
        renderAdminQueueControl();
    } else if (sectionId === "admin-layanan") {
        renderAdminServicesList();
    } else if (sectionId === "admin-barber") {
        renderAdminBarbersTab();
    } else if (sectionId === "admin-pelanggan") {
        renderAdminCustomersList();
    } else if (sectionId === "admin-inventori") {
        renderAdminInventory();
    } else if (sectionId === "admin-pengaturan") {
        renderAdminSettings();
    }
}

function renderAdminDashboard() {
    // 1. Calculate Statistics Card Values
    const totalBookingsCount = store.bookings.length;
    const pendingBookingsCount = store.bookings.filter(b => b.status === "Menunggu").length;
    
    // Revenue logic (only completed services)
    const completedBookings = store.bookings.filter(b => b.status === "Selesai");
    const totalRev = completedBookings.reduce((sum, b) => sum + b.price, 0);
    
    // Active queues count
    const activeQueueCount = [
        ...store.bookings.filter(b => b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani"),
        ...store.walkins.filter(w => w.status === "Menunggu" || w.status === "Sedang Dilayani")
    ].length;

    document.getElementById("admStatBookings").innerText = totalBookingsCount;
    document.getElementById("admStatPending").innerText = pendingBookingsCount;
    document.getElementById("admStatActiveQueue").innerText = activeQueueCount;
    document.getElementById("admStatRevenue").innerText = `Rp ${totalRev.toLocaleString('id-ID')}`;

    // 2. Render Latest Bookings Table
    const tbl = document.getElementById("adminDashboardRecentTable");
    const recentList = store.bookings.slice(0, 5); // 5 newest
    
    if (recentList.length === 0) {
        tbl.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Belum ada booking terdaftar.</td></tr>`;
    } else {
        tbl.innerHTML = recentList.map(b => {
            const srv = store.services.find(s => s.id === b.serviceId);
            const statusClass = b.status.toLowerCase().replace(/ /g, '-');
            
            return `
                <tr>
                    <td class="font-monospace fw-bold">${b.id}</td>
                    <td>${b.customerName}</td>
                    <td>${srv ? srv.name : 'Layanan'}</td>
                    <td>${b.date} @ ${b.time}</td>
                    <td><span class="badge-status ${statusClass}">${b.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    // 3. Render Chart.js Dynamic Charts
    initDashboardCharts();
}

function initDashboardCharts() {
    // Destroy previous chart instances to prevent canvas ghosting
    if (salesChart) salesChart.destroy();
    if (barberChart) barberChart.destroy();

    const salesCtx = document.getElementById("adminChartSales").getContext("2d");
    const barberCtx = document.getElementById("adminChartBarber").getContext("2d");

    // Sales Revenue Last 7 Days (Mocked logic from finished bookings)
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const salesData = [350000, 480000, 290000, 510000, 750000, 980000, 820000]; // Realistic default curve

    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Pendapatan (Rp)',
                data: salesData,
                borderColor: '#D97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });

    // Bookings count per Barber Chart
    const barberNames = store.barbers.map(b => b.name.split(' ')[0]);
    const barberCounts = store.barbers.map(bbr => store.bookings.filter(b => b.barberId === bbr.id).length);

    barberChart = new Chart(barberCtx, {
        type: 'bar',
        data: {
            labels: barberNames,
            datasets: [{
                label: 'Jumlah Booking',
                data: barberCounts,
                backgroundColor: 'rgba(217, 119, 6, 0.75)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF', stepSize: 1 } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });
}

// Admin Booking Management Tab
function renderAdminBookingList() {
    const listBody = document.getElementById("adminBookingTableBody");
    
    if (store.bookings.length === 0) {
        listBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada pemesanan.</td></tr>`;
        return;
    }

    listBody.innerHTML = store.bookings.map(b => {
        const srv = store.services.find(s => s.id === b.serviceId);
        const bbr = store.barbers.find(x => x.id === b.barberId);
        const statusClass = b.status.toLowerCase().replace(/ /g, '-');
        
        let paymentBadge = "";
        let paymentAction = "";
        
        if (b.paymentStatus === "Lunas") {
            paymentBadge = `<br><span class="badge bg-success font-monospace" style="font-size:0.6rem;">LUNAS</span>`;
        } else if (b.paymentStatus === "Menunggu Konfirmasi") {
            paymentBadge = `<br><span class="badge bg-secondary font-monospace" style="font-size:0.6rem; cursor:pointer;" onclick="openInvoiceModal('${b.id}')">VERIFIKASI BUKTI</span>`;
            paymentAction = `<button class="btn btn-sm btn-success text-white me-1" onclick="confirmPaymentReceipt('${b.id}')" title="Konfirmasi Lunas"><i class="fas fa-check-double"></i> Lunas</button>`;
        } else if (b.status !== "Selesai" && b.status !== "Dibatalkan") {
            paymentBadge = `<br><span class="badge bg-warning text-dark font-monospace" style="font-size:0.6rem;">BELUM LUNAS</span>`;
        }
        
        let actionButtons = "";
        if (b.status === "Menunggu") {
            actionButtons = `
                <button class="btn btn-sm btn-info text-white me-1" onclick="updateBookingStatus('${b.id}', 'Dikonfirmasi')"><i class="fas fa-check"></i> Setujui</button>
                <button class="btn btn-sm btn-danger" onclick="updateBookingStatus('${b.id}', 'Dibatalkan')"><i class="fas fa-times"></i></button>
            `;
        } else if (b.status === "Dikonfirmasi") {
            actionButtons = `
                <button class="btn btn-sm btn-primary text-white me-1" onclick="updateBookingStatus('${b.id}', 'Sedang Dilayani')"><i class="fas fa-chair"></i> Layani</button>
            `;
        } else if (b.status === "Sedang Dilayani") {
            actionButtons = `
                <button class="btn btn-sm btn-success text-white" onclick="updateBookingStatus('${b.id}', 'Selesai')"><i class="fas fa-flag-checkered"></i> Selesai</button>
            `;
        }
        
        return `
            <tr>
                <td class="font-monospace fw-bold">${b.id}</td>
                <td>
                    <strong class="d-block text-white">${b.customerName}</strong>
                    <small class="text-muted">${b.customerPhone}</small>
                </td>
                <td>${srv ? srv.name : 'Unknown Service'}</td>
                <td>${bbr ? bbr.name : 'Unknown Barber'}</td>
                <td>${b.date} @ ${b.time}</td>
                <td><span class="badge-status ${statusClass}">${b.status}</span>${paymentBadge}</td>
                <td>
                    <div class="d-flex">
                        <button class="btn btn-sm btn-outline-warning me-1" onclick="openInvoiceModal('${b.id}')" title="Cetak Struk"><i class="fas fa-print"></i></button>
                        ${paymentAction}
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateBookingStatus(bkgId, newStatus) {
    const b = store.bookings.find(x => x.id === bkgId);
    if (b) {
        b.status = newStatus;
        saveToLocalStorage();
        
        if (isFirebaseConnected && db) {
            db.collection("bookings").doc(bkgId).update({ status: newStatus })
                .catch(err => console.error("Firestore booking update status error:", err));
        }
        
        showSuccessToast(`Booking ${bkgId} status berhasil dirubah ke: <strong>${newStatus}</strong>`);
        
        // Refresh active section
        if (document.getElementById("admin-booking") && document.getElementById("admin-booking").classList.contains("d-none") === false) {
            renderAdminBookingList();
        } else if (typeof renderAdminDashboard === "function") {
            renderAdminDashboard();
        }
    }
}

// Queue Board Control Interface
function renderAdminQueueControl() {
    const activeList = document.getElementById("adminActiveQueueList");
    
    // Dynamic Filter Queues: Only get Menunggu & Sedang Dilayani
    const bookingQueues = store.bookings
        .filter(b => b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
        .map(b => ({
            id: b.id,
            name: b.customerName,
            service: store.services.find(s => s.id === b.serviceId).name,
            barber: store.barbers.find(x => x.id === b.barberId).name,
            type: "Online Booking",
            status: b.status,
            time: b.time
        }));

    const walkinQueues = store.walkins
        .filter(w => w.status === "Menunggu" || w.status === "Sedang Dilayani")
        .map(w => ({
            id: w.id,
            name: w.customerName,
            service: store.services.find(s => s.id === w.serviceId).name,
            barber: store.barbers.find(x => x.id === w.barberId).name,
            type: "Walk-in",
            status: w.status,
            time: w.timeAdded
        }));

    // Merge & Sort: "Sedang Dilayani" first, then sort by scheduled time
    const merged = [...bookingQueues, ...walkinQueues];
    merged.sort((x, y) => {
        if (x.status === "Sedang Dilayani" && y.status !== "Sedang Dilayani") return -1;
        if (x.status !== "Sedang Dilayani" && y.status === "Sedang Dilayani") return 1;
        return x.time.localeCompare(y.time);
    });

    if (merged.length === 0) {
        activeList.innerHTML = `<div class="alert alert-secondary text-center text-muted border-0 py-4"><i class="fas fa-clipboard-list me-2 fs-4"></i> Antrean aktif kosong.</div>`;
        return;
    }

    activeList.innerHTML = merged.map((q, index) => {
        const isActive = q.status === "Sedang Dilayani";
        let statusBadge = `<span class="badge bg-warning text-dark">Antre</span>`;
        if (isActive) statusBadge = `<span class="badge bg-primary text-white"><span class="live-dot"></span>Sedang Dilayani</span>`;
        
        let controlBtns = "";
        if (!isActive) {
            controlBtns = `<button class="btn btn-gold btn-sm" onclick="callQueueNext('${q.id}', '${q.type}')"><i class="fas fa-volume-up me-1"></i> Layani</button>`;
        } else {
            controlBtns = `<button class="btn btn-success btn-sm" onclick="completeQueueItem('${q.id}', '${q.type}')"><i class="fas fa-check-circle me-1"></i> Selesai</button>`;
        }
        
        return `
            <div class="card premium-card-dark p-3 mb-3" style="${isActive ? 'border: 2px solid var(--primary);' : ''}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center mb-1">
                            <span class="fs-5 fw-bold text-white me-2">#${index + 1} (${q.time})</span>
                            <span class="badge bg-secondary font-monospace me-2">${q.id}</span>
                            ${statusBadge}
                        </div>
                        <h6 class="mb-1 text-white">${q.name} <small class="text-white-50">(${q.type})</small></h6>
                        <small class="text-muted"><i class="fas fa-cut me-1"></i>Layanan: <strong>${q.service}</strong> | Barber: <strong>${q.barber}</strong></small>
                    </div>
                    <div>
                        ${controlBtns}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Prepopulate Walk-in select options
    const srvSel = document.getElementById("walkinServiceSelect");
    const bbrSel = document.getElementById("walkinBarberSelect");
    
    if (srvSel) srvSel.innerHTML = store.services.map(s => `<option value="${s.id}">${s.name} (Rp ${s.price.toLocaleString('id-ID')})</option>`).join('');
    if (bbrSel) bbrSel.innerHTML = store.barbers.filter(b => b.active).map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function callQueueNext(id, type) {
    if (type === "Online Booking") {
        updateBookingStatus(id, "Sedang Dilayani");
    } else {
        const w = store.walkins.find(x => x.id === id);
        if (w) {
            w.status = "Sedang Dilayani";
            saveToLocalStorage();
            if (isFirebaseConnected && db) {
                db.collection("walkins").doc(id).update({ status: "Sedang Dilayani" })
                    .catch(err => console.error("Firestore walkin status error:", err));
            }
        }
    }
    showSuccessToast(`Memanggil pelanggan dengan ID <strong>${id}</strong> untuk segera dilayani!`);
    renderAdminQueueControl();
}

function completeQueueItem(id, type) {
    if (type === "Online Booking") {
        updateBookingStatus(id, "Selesai");
    } else {
        const w = store.walkins.find(x => x.id === id);
        if (w) {
            w.status = "Selesai";
            saveToLocalStorage();
            if (isFirebaseConnected && db) {
                db.collection("walkins").doc(id).update({ status: "Selesai" })
                    .catch(err => console.error("Firestore walkin status error:", err));
            }
        }
    }
    showSuccessToast(`Layanan untuk ID <strong>${id}</strong> telah dinyatakan <strong>Selesai</strong>.`);
    renderAdminQueueControl();
}

function addWalkinFromAdmin() {
    const custName = document.getElementById("walkinNameInput").value.trim();
    const serviceId = document.getElementById("walkinServiceSelect").value;
    const barberId = document.getElementById("walkinBarberSelect").value;
    
    if (!custName) {
        alert("Mohon masukkan nama pelanggan!");
        return;
    }
    
    const count = store.walkins.length + 1;
    const qId = `Q-${count.toString().padStart(3, '0')}`;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newWalkin = {
        id: qId,
        customerName: custName,
        serviceId: serviceId,
        barberId: barberId,
        status: "Menunggu",
        timeAdded: timeStr
    };
    
    store.walkins.push(newWalkin);
    saveToLocalStorage();
    
    if (isFirebaseConnected && db) {
        const dbWalkin = { ...newWalkin };
        delete dbWalkin.id;
        db.collection("walkins").doc(newWalkin.id).set(dbWalkin)
            .catch(err => console.error("Firestore walkin write error:", err));
    }
    
    document.getElementById("adminAddWalkinForm").reset();
    showSuccessToast(`Antrean walk-in berhasil ditambahkan: <strong>${qId} (${custName})</strong>`);
    renderAdminQueueControl();
}

// Services CRUD Manager Tab
function renderAdminServicesList() {
    const tbody = document.getElementById("adminServicesTableBody");
    tbody.innerHTML = store.services.map(srv => `
        <tr>
            <td><img src="${srv.photo}" class="rounded" style="width: 45px; height: 45px; object-fit: cover;"></td>
            <td class="fw-bold text-white">${srv.name}</td>
            <td>${srv.category}</td>
            <td>Rp ${srv.price.toLocaleString('id-ID')}</td>
            <td>${srv.duration} Menit</td>
            <td><span class="badge bg-warning text-dark">${srv.tag || 'Normal'}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteService('${srv.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function addServiceFromAdmin() {
    const n = document.getElementById("addSrvName").value.trim();
    const cat = document.getElementById("addSrvCategory").value;
    const price = parseInt(document.getElementById("addSrvPrice").value);
    const dur = parseInt(document.getElementById("addSrvDuration").value);
    const photo = document.getElementById("addSrvPhoto").value.trim() || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300&auto=format&fit=crop";
    const tag = document.getElementById("addSrvTag").value;
    
    if (!n || !price || !dur) {
        alert("Mohon lengkapi formulir!");
        return;
    }
    
    const newSrv = {
        id: `srv-${Date.now()}`,
        name: n,
        category: cat,
        price: price,
        duration: dur,
        desc: `Perawatan rambut premium ${n} ditangani oleh ahlinya.`,
        photo: photo,
        tag: tag
    };
    
    store.services.push(newSrv);
    saveToLocalStorage();
    
    if (isFirebaseConnected && db) {
        const dbSrv = { ...newSrv };
        delete dbSrv.id;
        db.collection("services").doc(newSrv.id).set(dbSrv)
            .catch(err => console.error("Firestore service write error:", err));
    }
    
    // Hide Modal
    const modalEl = document.getElementById("adminAddServiceModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    document.getElementById("adminAddServiceForm").reset();
    showSuccessToast(`Layanan <strong>${n}</strong> berhasil ditambahkan!`);
    renderAdminServicesList();
}

function deleteService(srvId) {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini dari katalog?")) {
        store.services = store.services.filter(s => s.id !== srvId);
        saveToLocalStorage();
        
        if (isFirebaseConnected && db) {
            db.collection("services").doc(srvId).delete()
                .catch(err => console.error("Firestore service delete error:", err));
        }
        
        showSuccessToast("Layanan berhasil dihapus.");
        renderAdminServicesList();
    }
}

// Barber CRUD tab manager
function renderAdminBarbersTab() {
    const tbody = document.getElementById("adminBarbersTableBody");
    tbody.innerHTML = store.barbers.map(b => {
        // Calculate dynamic commissions
        const bkgDone = store.bookings.filter(bkg => bkg.barberId === b.id && bkg.status === "Selesai");
        const totalCustomers = bkgDone.length;
        const commissions = totalCustomers * 15000; // Rp 15k commission per cut
        
        return `
            <tr>
                <td><img src="${b.photo}" class="rounded-circle" style="width: 45px; height: 45px; object-fit: cover;"></td>
                <td class="fw-bold text-white">${b.name}</td>
                <td>${b.spec}</td>
                <td><i class="fas fa-star text-warning me-1"></i>${b.rating.toFixed(1)}</td>
                <td>${totalCustomers} Pelanggan</td>
                <td class="text-success fw-bold">Rp ${commissions.toLocaleString('id-ID')}</td>
                <td>
                    <button class="btn btn-sm ${b.active ? 'btn-success' : 'btn-secondary'}" onclick="toggleBarberActive('${b.id}')">
                        ${b.active ? 'Aktif' : 'Libur'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function addBarberFromAdmin() {
    const n = document.getElementById("addBbrName").value.trim();
    const spec = document.getElementById("addBbrSpec").value.trim();
    const photo = document.getElementById("addBbrPhoto").value.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
    
    if (!n || !spec) {
        alert("Mohon isi semua data barber!");
        return;
    }
    
    const newBarber = {
        id: `bbr-${Date.now()}`,
        name: n,
        spec: spec,
        rating: 5.0,
        reviewsCount: 0,
        photo: photo,
        active: true
    };
    
    store.barbers.push(newBarber);
    saveToLocalStorage();
    
    if (isFirebaseConnected && db) {
        const dbBbr = { ...newBarber };
        delete dbBbr.id;
        db.collection("barbers").doc(newBarber.id).set(dbBbr)
            .catch(err => console.error("Firestore barber write error:", err));
    }
    
    // Hide Modal
    const modalEl = document.getElementById("adminAddBarberModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    document.getElementById("adminAddBarberForm").reset();
    showSuccessToast(`Barber baru <strong>${n}</strong> berhasil direkrut!`);
    renderAdminBarbersTab();
}

function toggleBarberActive(bbrId) {
    const b = store.barbers.find(x => x.id === bbrId);
    if (b) {
        b.active = !b.active;
        saveToLocalStorage();
        
        if (isFirebaseConnected && db) {
            db.collection("barbers").doc(bbrId).update({ active: b.active })
                .catch(err => console.error("Firestore barber active update error:", err));
        }
        
        showSuccessToast(`Status aktif barber <strong>${b.name}</strong> diubah.`);
        renderAdminBarbersTab();
    }
}

// Customers Tab list
function renderAdminCustomersList() {
    const tbody = document.getElementById("adminCustomersTableBody");
    
    // Collect unique customer emails from bookings to simulate user registry
    const usersMap = {};
    
    // Seed default active user first
    usersMap[store.activeUser.email] = {
        name: store.activeUser.name,
        phone: store.activeUser.phone,
        email: store.activeUser.email,
        points: store.activeUser.points,
        membership: store.activeUser.membership,
        totalVisits: store.bookings.filter(b => b.customerEmail === store.activeUser.email && b.status === "Selesai").length
    };

    store.bookings.forEach(b => {
        if (!usersMap[b.customerEmail]) {
            usersMap[b.customerEmail] = {
                name: b.customerName,
                phone: b.customerPhone,
                email: b.customerEmail,
                points: Math.round(b.price / 1000) + 10,
                membership: "Silver",
                totalVisits: store.bookings.filter(x => x.customerEmail === b.customerEmail && x.status === "Selesai").length
            };
            
            // Calc membership tier
            const pts = usersMap[b.customerEmail].points;
            if (pts >= 300) usersMap[b.customerEmail].membership = "Platinum";
            else if (pts >= 120) usersMap[b.customerEmail].membership = "Gold";
        }
    });

    const customersArray = Object.values(usersMap);

    tbody.innerHTML = customersArray.map(c => `
        <tr>
            <td class="fw-bold text-white">${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td><span class="badge bg-dark border font-monospace">${c.membership}</span></td>
            <td>${c.points} Pts</td>
            <td>${c.totalVisits} Kunjungan</td>
        </tr>
    `).join('');
}

// Products and Inventory
function renderAdminInventory() {
    const tbody = document.getElementById("adminInventoryTableBody");
    
    const items = [
        { name: "Suavecito Pomade Original", price: 145000, stock: 18, limit: 5 },
        { name: "Layrite Cement Clay Extra Strong", price: 285000, stock: 12, limit: 3 },
        { name: "Murrays Superior Pomade Classic", price: 95000, stock: 4, limit: 5 },
        { name: "Hair Tonic Essential Red", price: 65000, stock: 25, limit: 10 },
        { name: "Razor Shaving Cream Sandalwood", price: 80000, stock: 2, limit: 5 }
    ];

    tbody.innerHTML = items.map(item => {
        const isLow = item.stock <= item.limit;
        return `
            <tr>
                <td class="fw-bold text-white">${item.name}</td>
                <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                <td class="${isLow ? 'text-danger fw-bold' : ''}">${item.stock} Pcs</td>
                <td>
                    ${isLow ? `<span class="badge bg-danger">STOK MENIPIS</span>` : `<span class="badge bg-success">AMAN</span>`}
                </td>
            </tr>
        `;
    }).join('');
}

// Admin System Settings UI
function renderAdminSettings() {
    document.getElementById("admSettingName").value = store.settings.storeName;
    document.getElementById("admSettingAddress").value = store.settings.storeAddress;
    document.getElementById("admSettingOpen").value = store.settings.storeOpen;
    document.getElementById("admSettingClose").value = store.settings.storeClose;
}

function saveSystemSettings() {
    const n = document.getElementById("admSettingName").value.trim();
    const a = document.getElementById("admSettingAddress").value.trim();
    const o = document.getElementById("admSettingOpen").value.trim();
    const c = document.getElementById("admSettingClose").value.trim();
    
    if (!n || !a) {
        alert("Semua field wajib diisi!");
        return;
    }
    
    store.settings.storeName = n;
    store.settings.storeAddress = a;
    store.settings.storeOpen = o;
    store.settings.storeClose = c;
    
    saveToLocalStorage();
    
    if (isFirebaseConnected && db) {
        db.collection("settings").doc("global").set(store.settings)
            .catch(err => console.error("Firestore settings save error:", err));
    }
    
    showSuccessToast("Konfigurasi sistem berhasil diperbarui!");
}


// -------------------------------------------
// 4. TV SCREEN MONITOR RENDERING
// -------------------------------------------
function renderTvScreen() {
    const dateText = document.getElementById("tvCurrentDateText");
    const timeText = document.getElementById("tvCurrentTimeText");
    
    // Display dynamic clock
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (dateText) dateText.innerText = now.toLocaleDateString('id-ID', options);
    
    function tickClock() {
        const n = new Date();
        if (timeText) timeText.innerText = `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')} WIB`;
    }
    tickClock();
    setInterval(tickClock, 1000);

    // Render Queues on Large Screen Layout
    const tvActive = document.getElementById("tvActiveQueueBox");
    const tvWaiting = document.getElementById("tvWaitingGrid");
    
    // Sort Queues
    const bookingQueues = store.bookings
        .filter(b => b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
        .map(b => ({ id: b.id, name: b.customerName, barber: store.barbers.find(x => x.id === b.barberId).name, status: b.status, time: b.time }));
        
    const walkinQueues = store.walkins
        .filter(w => w.status === "Menunggu" || w.status === "Sedang Dilayani")
        .map(w => ({ id: w.id, name: w.customerName, barber: store.barbers.find(x => x.id === w.barberId).name, status: w.status, time: w.timeAdded }));
        
    const merged = [...bookingQueues, ...walkinQueues];
    merged.sort((x, y) => {
        if (x.status === "Sedang Dilayani" && y.status !== "Sedang Dilayani") return -1;
        if (x.status !== "Sedang Dilayani" && y.status === "Sedang Dilayani") return 1;
        return x.time.localeCompare(y.time);
    });

    const activeItem = merged.find(q => q.status === "Sedang Dilayani");
    const waitingItems = merged.filter(q => q.status !== "Sedang Dilayani").slice(0, 6);

    // 1. Render Active item
    if (!activeItem) {
        tvActive.innerHTML = `
            <div class="p-5 text-center text-muted">
                <h3 class="display-6">Belum Ada Pelayanan</h3>
                <p class="fs-5">Menunggu panggilan antrean dari Admin...</p>
            </div>
        `;
    } else {
        tvActive.innerHTML = `
            <div class="text-center p-4">
                <span class="badge bg-danger fs-6 mb-3 py-2 px-4"><span class="live-dot"></span>SEDANG DILAYANI</span>
                <div class="display-2 fw-bold text-warning mb-2" style="color: var(--primary); font-size:6rem;">
                    ${activeItem.time}
                </div>
                <h2 class="display-5 fw-bold mb-2">${activeItem.name}</h2>
                <h4 class="text-muted"><i class="fas fa-user-tie me-2 text-warning"></i>Stylist: <strong>${activeItem.barber}</strong></h4>
            </div>
        `;
    }

    // 2. Render list of waiting queues
    if (waitingItems.length === 0) {
        tvWaiting.innerHTML = `
            <div class="col-12">
                <div class="alert alert-secondary text-center fs-4 border-0 py-4" style="background: rgba(255,255,255,0.05); color:#9CA3AF;">
                    Antrean tunggu kosong.
                </div>
            </div>
        `;
    } else {
        tvWaiting.innerHTML = waitingItems.map((q, idx) => `
            <div class="col-md-6 mb-3 animate-slide">
                <div class="tv-queue-card-normal p-3 d-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center mb-1">
                            <span class="fs-4 fw-bold text-white me-2">${q.time}</span>
                            <span class="badge bg-dark text-warning border-warning font-monospace">${q.id}</span>
                        </div>
                        <h5 class="mb-0 text-white-50">${q.name}</h5>
                    </div>
                    <div class="text-end">
                        <small class="text-muted d-block">Barber</small>
                        <strong class="text-white">${q.barber.split(' ')[0]}</strong>
                    </div>
                </div>
            </div>
        `).join('');
    }
}


// -------------------------------------------
// HELPER UTILITIES
// -------------------------------------------
function showSuccessToast(message) {
    // Dynamic Toast Injector
    const container = document.getElementById("toastContainer");
    if (!container) return;
    
    const toastId = `toast-${Date.now()}`;
    
    const html = `
        <div id="${toastId}" class="toast align-items-center text-white border-0 py-2 animate-slide" role="alert" aria-live="assertive" aria-atomic="true" style="background: rgba(11, 15, 25, 0.95); backdrop-filter:blur(10px); border-left: 5px solid var(--primary) !important; box-shadow: var(--shadow-lg);">
            <div class="d-flex">
                <div class="toast-body fs-6">
                    <i class="fas fa-check-circle text-warning me-2 fs-5"></i> ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    const toastEl = document.getElementById(toastId);
    
    const bsToast = new bootstrap.Toast(toastEl, { delay: 5000 });
    bsToast.show();
    
    // Remove element on hide
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}


/* ======================================================== */
/* PHASE 2: HAIR STYLE FILTER GALLERY & LIGHTBOX LIGHT      */
/* ======================================================== */
const GALLERY_ITEMS = [
    { name: "Textured Skin Fade", style: "fade", desc: "Potongan samping gradasi kulit sangat tipis dengan bagian atas bertekstur.", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop" },
    { name: "Slickback Classic Pompadour", style: "pompadour", desc: "Model klimis bervolume tinggi bergaya vintage aristokrat.", photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop" },
    { name: "Disconnected Slick Undercut", style: "undercut", desc: "Undercut tajam kontras bagian bawah bersih dengan rambut atas panjang rapi.", photo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop" },
    { name: "Clean Structured Buzzcut", style: "buzzcut", desc: "Model potong cepak rapi presisi 1-2 cm, sangat maskulin & praktis.", photo: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f4a5?q=80&w=400&auto=format&fit=crop" },
    { name: "Low Taper Drop Fade", style: "fade", desc: "Taper fade gradien tipis bagian telinga dan tengkuk saja.", photo: "https://images.unsplash.com/photo-1599351431247-f5094087e882?q=80&w=400&auto=format&fit=crop" },
    { name: "Messy Undercut Pomade", style: "undercut", desc: "Gaya santai bertekstur natural dengan pinggiran undercut rapi.", photo: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop" }
];

function filterGallery(style, btn) {
    const grid = document.getElementById("publicGalleryGrid");
    if (!grid) return;
    
    // Set active button class
    if (btn) {
        const btns = btn.parentElement.querySelectorAll("button");
        btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }

    const filtered = style === "semua" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.style === style);
    
    grid.innerHTML = filtered.map(item => `
        <div class="col-md-4 mb-3 animate-slide">
            <div class="gallery-item cursor-pointer" onclick="openLightbox('${item.photo}', '${item.name} - ${item.desc}')">
                <img src="${item.photo}" class="gallery-image" alt="${item.name}">
                <div class="gallery-overlay">
                    <h5 class="text-white mb-0">${item.name}</h5>
                    <small class="text-warning text-uppercase">${item.style}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function openLightbox(imgUrl, caption) {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImg");
    const capt = document.getElementById("lightboxCaption");
    
    if (modal && img && capt) {
        img.src = imgUrl;
        capt.innerText = caption;
        modal.style.display = "block";
    }
}

function closeLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (modal) modal.style.display = "none";
}


/* ======================================================== */
/* PHASE 2: RECEIPT PAYMENTS & INVOICES                     */
/* ======================================================== */
let activePaymentBookingId = "";

function openPaymentModal(bkgId) {
    activePaymentBookingId = bkgId;
    const modal = new bootstrap.Modal(document.getElementById("customerPaymentModal"));
    modal.show();
}

function submitPaymentReceipt() {
    const fileInput = document.getElementById("receiptFileInput");
    if (!fileInput || !fileInput.files.length) {
        alert("Mohon pilih file bukti transfer!");
        return;
    }
    
    const bkg = store.bookings.find(b => b.id === activePaymentBookingId);
    if (bkg) {
        bkg.paymentStatus = "Menunggu Konfirmasi";
        saveToLocalStorage();
        
        if (isFirebaseConnected && db) {
            db.collection("bookings").doc(activePaymentBookingId).update({ paymentStatus: "Menunggu Konfirmasi" })
                .catch(err => console.error("Firestore payment status update error:", err));
        }
        
        const modalEl = document.getElementById("customerPaymentModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
        fileInput.value = ""; // reset file input
        showSuccessToast("Bukti pembayaran berhasil diunggah! Menunggu konfirmasi verifikasi admin.");
        renderCustomerActiveSection("cust-riwayat");
    }
}

function confirmPaymentReceipt(bkgId) {
    const bkg = store.bookings.find(b => b.id === bkgId);
    if (bkg) {
        bkg.paymentStatus = "Lunas";
        bkg.status = "Dikonfirmasi"; // auto approve when lunas
        saveToLocalStorage();
        
        if (isFirebaseConnected && db) {
            db.collection("bookings").doc(bkgId).update({
                paymentStatus: "Lunas",
                status: "Dikonfirmasi"
            }).catch(err => console.error("Firestore payment confirm error:", err));
        }
        
        showSuccessToast(`Bukti pembayaran untuk <strong>${bkgId}</strong> telah dinyatakan <strong>LUNAS</strong>.`);
        renderAdminBookingList();
    }
}

function openInvoiceModal(bkgId) {
    const b = store.bookings.find(x => x.id === bkgId);
    if (!b) return;
    
    const srv = store.services.find(s => s.id === b.serviceId);
    const bbr = store.barbers.find(x => x.id === b.barberId);
    
    document.getElementById("invBookingId").innerText = b.id;
    document.getElementById("invDate").innerText = b.date;
    document.getElementById("invCustomer").innerText = b.customerName;
    document.getElementById("invBarber").innerText = bbr ? bbr.name : 'Unknown';
    document.getElementById("invServiceName").innerText = srv ? srv.name : 'Unknown Service';
    document.getElementById("invServicePrice").innerText = `Rp ${srv ? srv.price.toLocaleString('id-ID') : '0'}`;
    
    const discountRow = document.getElementById("invDiscountRow");
    const discountVal = document.getElementById("invDiscountValue");
    const couponCode = document.getElementById("invCouponCode");
    
    const discount = srv ? srv.price - b.price : 0;
    
    if (discount > 0) {
        discountRow.classList.remove("d-none");
        discountVal.innerText = discount.toLocaleString('id-ID');
        couponCode.innerText = b.codeVoucher || 'PROMO';
    } else {
        discountRow.classList.add("d-none");
    }
    
    document.getElementById("invTotalPay").innerText = `Rp ${b.price.toLocaleString('id-ID')}`;
    
    const modal = new bootstrap.Modal(document.getElementById("invoicePrintModal"));
    modal.show();
}


/* ======================================================== */
/* PHASE 2: ADMINISTRATIVE EXTENSIONS (CSV, PDF, VOUCHERS)  */
/* ======================================================== */
function exportCustomersToCSV() {
    const usersMap = {};
    usersMap[store.activeUser.email] = { name: store.activeUser.name, phone: store.activeUser.phone, email: store.activeUser.email, points: store.activeUser.points, tier: store.activeUser.membership };
    
    store.bookings.forEach(b => {
        if (!usersMap[b.customerEmail]) {
            usersMap[b.customerEmail] = { name: b.customerName, phone: b.customerPhone, email: b.customerEmail, points: Math.round(b.price / 1000) + 10, tier: "Silver" };
        }
    });
    
    const arr = Object.values(usersMap);
    let csv = "Nama Lengkap,No Telepon,Email,Level Membership,Akumulasi Poin\n";
    
    arr.forEach(c => {
        csv += `"${c.name}","${c.phone}","${c.email}","${c.tier}",${c.points}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Database_Pelanggan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessToast("Database pelanggan berhasil diekspor ke file CSV!");
}

function filterFinancials() {
    const startStr = document.getElementById("financialStartDate").value;
    const endStr = document.getElementById("financialEndDate").value;
    
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const completed = store.bookings.filter(b => {
        const d = new Date(b.date);
        return b.status === "Selesai" && d >= start && d <= end;
    });
    
    const revServices = completed.reduce((sum, b) => sum + b.price, 0);
    const commissions = completed.length * 15000;
    const netProfit = revServices - commissions;
    
    document.getElementById("finStatServices").innerText = `Rp ${revServices.toLocaleString('id-ID')}`;
    document.getElementById("finStatCommissions").innerText = `Rp ${commissions.toLocaleString('id-ID')}`;
    document.getElementById("finStatNetProfit").innerText = `Rp ${netProfit.toLocaleString('id-ID')}`;
    
    const tbody = document.getElementById("adminFinancialTableBody");
    if (completed.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Tidak ada transaksi tercatat pada rentang tanggal ini.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = completed.map(b => {
        const srv = store.services.find(s => s.id === b.serviceId);
        return `
            <tr>
                <td>${b.date}</td>
                <td>Penyelesaian Jasa: <strong class="text-white">${srv ? srv.name : 'Potong Rambut'}</strong> (${b.id})</td>
                <td><span class="badge bg-success">Jasa Masuk</span></td>
                <td class="text-success fw-bold">+ Rp ${b.price.toLocaleString('id-ID')}</td>
                <td class="text-white-50">- Rp 0</td>
            </tr>
            <tr>
                <td>${b.date}</td>
                <td>Pengeluaran Komisi Barber (${b.id})</td>
                <td><span class="badge bg-danger">Operasional</span></td>
                <td class="text-white-50">+ Rp 0</td>
                <td class="text-danger fw-bold">- Rp 15.000</td>
            </tr>
        `;
    }).join('');
}

function simulateExportFinancialPDF() {
    alert("Ekspor Keuangan Dinonaktifkan: Simulasi pencetakan PDF laporan keuangan Majestic Cuts berhasil dipicu! Laporan PDF diunduh.");
    showSuccessToast("Laporan PDF berhasil diunduh.");
}

function renderAdminVoucherList() {
    const tbody = document.getElementById("adminVoucherTableBody");
    if (tbody) {
        tbody.innerHTML = Object.entries(VOUCHERS).map(([code, val]) => {
            const isPercent = val < 1;
            const discountStr = isPercent ? `${val * 100}%` : `Rp ${val.toLocaleString('id-ID')}`;
            
            return `
                <tr>
                    <td class="fw-bold text-white font-monospace">${code}</td>
                    <td class="text-warning fw-bold">${discountStr}</td>
                    <td>${isPercent ? 'Persentase' : 'Nominal Langsung'}</td>
                    <td><span class="badge bg-success">AKTIF</span></td>
                </tr>
            `;
        }).join('');
    }
}

function addNewVoucherFromAdmin() {
    const code = document.getElementById("newVoucherCode").value.toUpperCase().trim();
    const type = document.getElementById("newVoucherType").value;
    const val = parseFloat(document.getElementById("newVoucherValue").value);
    
    if (!code || isNaN(val)) {
        alert("Mohon masukkan kode dan nilai diskon yang valid!");
        return;
    }
    
    VOUCHERS[code] = val;
    showSuccessToast(`Voucher promo baru <strong>${code}</strong> berhasil diaktifkan!`);
    document.getElementById("adminAddVoucherForm").reset();
    toggleVoucherValueLabel();
    renderAdminVoucherList();
}

function toggleVoucherValueLabel() {
    const type = document.getElementById("newVoucherType").value;
    const label = document.getElementById("voucherValueLabel");
    const input = document.getElementById("newVoucherValue");
    
    if (type === "persen") {
        label.innerText = "Nilai Diskon (Contoh: 0.15 untuk 15%)";
        input.placeholder = "0.15";
    } else {
        label.innerText = "Nilai Diskon Nominal (Rp)";
        input.placeholder = "20000";
    }
}


/* ======================================================== */
/* PHASE 2: ANDROID SIMULATOR LOGIC - USER / CUSTOMER APP   */
/* ======================================================== */
let androidUserActiveTab = "home";
let androidUserOnboarded = false;

function initAndroidUserApp() {
    const screen = document.getElementById("androidUserScreen");
    if (!screen) return;
    
    // Simulate current clock
    const clock = document.getElementById("androidUserTimeText");
    if (clock) {
        const d = new Date();
        clock.innerText = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    }

    if (!androidUserOnboarded) {
        renderAndroidUserOnboarding(1);
        // Hide bottom nav during onboarding
        document.getElementById("androidUserBottomNav").classList.add("d-none");
    } else {
        document.getElementById("androidUserBottomNav").classList.remove("d-none");
        navigateAndroidUser(androidUserActiveTab);
    }
}

function renderAndroidUserOnboarding(slideNum) {
    const screen = document.getElementById("androidUserScreen");
    const slides = [
        { title: "Booking Online Instan", desc: "Pilih layanan potong rambut favorit dan slot jam kosong secara langsung dalam hitungan detik.", img: "fa-calendar-check" },
        { title: "Pilih Stylist Terbaik", desc: "Bebas memilih barber andalan Anda berdasarkan ulasan bintang asli dari pelanggan.", img: "fa-user-tie" },
        { title: "Pantau Antrean Live", desc: "Tidak perlu lagi menunggu lama di ruang tunggu, pantau estimasi giliran langsung dari genggaman.", img: "fa-list-ol" }
    ];

    const slide = slides[slideNum - 1];
    screen.innerHTML = `
        <div class="phone-onboarding-slide animate-slide" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <div class="phone-onboarding-img">
                <i class="fas ${slide.img}"></i>
            </div>
            <h4 class="fw-bold mb-2">${slide.title}</h4>
            <p class="text-muted small px-3 mb-4">${slide.desc}</p>
            
            <div class="d-flex justify-content-center gap-1 mb-4">
                <span style="width:8px; height:8px; border-radius:50%; background:${slideNum===1?'var(--primary)':'#ccc'}"></span>
                <span style="width:8px; height:8px; border-radius:50%; background:${slideNum===2?'var(--primary)':'#ccc'}"></span>
                <span style="width:8px; height:8px; border-radius:50%; background:${slideNum===3?'var(--primary)':'#ccc'}"></span>
            </div>
            
            <div class="w-100 px-3">
                ${slideNum < 3 ? `
                    <button class="btn btn-gold btn-sm w-100 py-2" onclick="renderAndroidUserOnboarding(${slideNum + 1})">Berikutnya</button>
                ` : `
                    <button class="btn btn-gold btn-sm w-100 py-2" onclick="completeAndroidUserOnboarding()">Mulai Sekarang</button>
                `}
            </div>
        </div>
    `;
}

function completeAndroidUserOnboarding() {
    androidUserOnboarded = true;
    document.getElementById("androidUserBottomNav").classList.remove("d-none");
    navigateAndroidUser("home");
}

function navigateAndroidUser(tab) {
    androidUserActiveTab = tab;
    
    // Set nav button active styling
    const btns = document.querySelectorAll("#androidUserBottomNav .phone-nav-btn, .mobile-bottom-nav .mobile-nav-btn");
    btns.forEach(b => {
        b.classList.remove("active");
        if (b.getAttribute("onclick") && b.getAttribute("onclick").includes(tab)) {
            b.classList.add("active");
        }
    });

    const screen = document.getElementById("androidUserScreen");
    if (!screen) return;
    if (tab === "home") {
        renderAndroidUserHome(screen);
    } else if (tab === "booking") {
        renderAndroidUserBooking(screen);
    } else if (tab === "antrean") {
        renderAndroidUserQueue(screen);
    } else if (tab === "riwayat") {
        renderAndroidUserHistory(screen);
    } else if (tab === "profil") {
        renderAndroidUserProfile(screen);
    }
}

function renderAndroidUserHome(container) {
    // Check if there is any active booking
    const activeBooking = store.bookings.find(
        b => b.customerEmail === store.activeUser.email && (b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
    );

    container.innerHTML = `
        <div class="p-3 animate-slide">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <small class="text-muted d-block" style="font-size:0.7rem;">Selamat Datang,</small>
                    <strong class="text-dark" style="font-size:0.95rem;">${store.activeUser.name}</strong>
                </div>
                <span class="badge bg-warning text-dark font-monospace" style="font-size:0.6rem;">${store.activeUser.membership}</span>
            </div>
            
            <!-- Loyalty Widget -->
            <div class="card border-0 p-3 mb-3 text-white" style="background:linear-gradient(135deg, #1E3A8A, #3B82F6);">
                <div class="d-flex justify-content-between mb-2">
                    <span class="small opacity-75">Loyalty Points</span>
                    <strong class="font-monospace">${store.activeUser.points} PTS</strong>
                </div>
                <div class="progress mb-1" style="height:4px;">
                    <div class="progress-bar bg-warning" style="width:${store.activeUser.points >= 120 ? '75%' : '40%'}"></div>
                </div>
                <small style="font-size:0.6rem;" class="opacity-75">Tingkat: ${store.activeUser.membership} Member</small>
            </div>
            
            <!-- Quick Promo slider -->
            <div class="card border-0 bg-warning bg-opacity-10 p-3 mb-3 text-center border-warning border-opacity-20">
                <small class="text-warning fw-bold d-block mb-1">PROMO HARI JUMAT!</small>
                <h6 class="mb-1 text-dark fw-bold" style="font-size:0.8rem;">Gunakan kupon JUMATBERKAH untuk diskon 20%</h6>
            </div>
            
            <!-- Active booking card status -->
            <h6 class="fw-bold text-dark mb-2" style="font-size:0.8rem;">Booking Aktif</h6>
            ${activeBooking ? `
                <div class="card border-0 p-3 mb-3 bg-white shadow-sm rounded-3">
                    <div class="d-flex justify-content-between mb-1">
                        <strong class="font-monospace small text-dark">${activeBooking.id}</strong>
                        <span class="badge bg-info text-white" style="font-size:0.55rem;">${activeBooking.status}</span>
                    </div>
                    <div class="small fw-bold text-dark mb-2">${store.services.find(s => s.id === activeBooking.serviceId).name}</div>
                    <div class="d-flex justify-content-between text-muted" style="font-size:0.7rem;">
                        <span><i class="far fa-calendar me-1"></i>${activeBooking.date}</span>
                        <span><i class="far fa-clock me-1"></i>${activeBooking.time} WIB</span>
                    </div>
                </div>
            ` : `
                <div class="card border-0 p-3 mb-3 text-center bg-white shadow-sm rounded-3">
                    <p class="text-muted small mb-2">Belum ada booking terdaftar saat ini.</p>
                    <button class="btn btn-gold btn-sm py-2" onclick="navigateAndroidUser('booking')">Pesan Sekarang</button>
                </div>
            `}
            
            <!-- Recommended Services -->
            <h6 class="fw-bold text-dark mb-2" style="font-size:0.8rem;">Rekomendasi Layanan</h6>
            <div class="row g-2">
                ${store.services.slice(0, 2).map(srv => `
                    <div class="col-6">
                        <div class="card border-0 bg-white shadow-sm p-2 h-100 rounded-3 text-center">
                            <img src="${srv.photo}" class="rounded mb-2" style="width:100%; height:70px; object-fit:cover;">
                            <strong class="text-dark d-block mb-1" style="font-size:0.75rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${srv.name}</strong>
                            <small class="text-warning font-monospace fw-bold" style="font-size:0.7rem;">Rp ${srv.price.toLocaleString('id-ID')}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAndroidUserBooking(container) {
    container.innerHTML = `
        <div class="p-3 animate-slide">
            <h5 class="fw-bold text-dark mb-3">Booking Baru</h5>
            <form id="androidUserBookingForm" onsubmit="event.preventDefault(); submitAndroidUserBooking();">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Pilih Layanan</label>
                    <select class="form-select form-select-sm" id="andSrvSelect" onchange="updateAndroidBookingPrice()">
                        ${store.services.map(s => `<option value="${s.id}" data-price="${s.price}">${s.name} (Rp ${s.price.toLocaleString('id-ID')})</option>`).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Pilih Barber</label>
                    <select class="form-select form-select-sm" id="andBbrSelect">
                        ${store.barbers.filter(b => b.active).map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Tanggal Reservasi</label>
                    <input type="date" class="form-control form-control-sm" id="andDateSelect" required>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Pilih Jam Kedatangan</label>
                    <select class="form-select form-select-sm" id="andTimeSelect">
                        <option value="09:00">09:00 WIB</option>
                        <option value="10:00">10:00 WIB</option>
                        <option value="11:30">11:30 WIB</option>
                        <option value="13:00">13:00 WIB</option>
                        <option value="14:30">14:30 WIB</option>
                        <option value="16:00">16:00 WIB</option>
                        <option value="18:30">18:30 WIB</option>
                        <option value="19:30">19:30 WIB</option>
                    </select>
                </div>
                
                <div class="card p-3 mb-3 bg-light border-0">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="small">Estimasi Harga</span>
                        <strong class="small text-dark" id="andPriceText">Rp 0</strong>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-gold btn-sm w-100 py-2">Konfirmasi & Reservasi</button>
            </form>
        </div>
    `;
    
    // Set date min to today
    const dateSel = document.getElementById("andDateSelect");
    if (dateSel) {
        dateSel.min = new Date().toISOString().split('T')[0];
        dateSel.value = dateSel.min;
    }
    updateAndroidBookingPrice();
}

function updateAndroidBookingPrice() {
    const sel = document.getElementById("andSrvSelect");
    const txt = document.getElementById("andPriceText");
    if (sel && txt) {
        const price = parseInt(sel.options[sel.selectedIndex].getAttribute("data-price"));
        txt.innerText = `Rp ${price.toLocaleString('id-ID')}`;
    }
}

function submitAndroidUserBooking() {
    const serviceId = document.getElementById("andSrvSelect").value;
    const barberId = document.getElementById("andBbrSelect").value;
    const date = document.getElementById("andDateSelect").value;
    const time = document.getElementById("andTimeSelect").value;
    
    const srv = store.services.find(s => s.id === serviceId);
    
    const rand = Math.floor(100 + Math.random() * 900);
    const bookingId = `BKG-${date.replace(/-/g, '').slice(2)}-${rand}`;
    
    const newBkg = {
        id: bookingId,
        customerName: store.activeUser.name,
        customerPhone: store.activeUser.phone,
        customerEmail: store.activeUser.email,
        serviceId: serviceId,
        barberId: barberId,
        date: date,
        time: time,
        price: srv.price,
        status: "Menunggu",
        codeVoucher: "",
        pointsEarned: Math.round(srv.price / 1000),
        reviewLeft: false,
        paymentStatus: "Belum Bayar"
    };
    
    store.bookings.unshift(newBkg);
    store.activeUser.points += newBkg.pointsEarned;
    updateUserMembership();
    saveToLocalStorage();
    
    showSuccessToast(`Booking Android Berhasil: <strong>${bookingId}</strong>`);
    navigateAndroidUser("home");
}

function renderAndroidUserQueue(container) {
    const activeBooking = store.bookings.find(
        b => b.customerEmail === store.activeUser.email && (b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
    );

    if (!activeBooking) {
        container.innerHTML = `
            <div class="p-3 text-center animate-slide" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <i class="far fa-clipboard text-muted display-4 mb-3"></i>
                <h6 class="fw-bold mb-2">Antrean Anda Kosong</h6>
                <p class="text-muted small px-3">Silakan buat reservasi online terlebih dahulu untuk mulai memantau posisi antrean secara live.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="p-3 text-center animate-slide">
            <h5 class="fw-bold text-dark mb-4">Monitor Antrean Live</h5>
            
            <div class="queue-circle-container mb-4">
                <svg width="180" height="180">
                    <circle cx="90" cy="90" r="80" class="queue-circle-bg"></circle>
                    <circle cx="90" cy="90" r="80" class="queue-circle-progress" style="stroke-dashoffset: 120;"></circle>
                </svg>
                <div class="queue-circle-content">
                    <small class="text-muted small">No. Jam</small>
                    <h3 class="fw-bold text-amber-700 mb-0" style="color:var(--primary);">${activeBooking.time}</h3>
                    <small class="text-muted small">WIB</small>
                </div>
            </div>
            
            <div class="card border-0 bg-white shadow-sm p-3 mb-3 rounded-3 text-start">
                <div class="d-flex justify-content-between mb-2" style="font-size:0.75rem;">
                    <span class="text-muted">Status Pelayanan:</span>
                    <strong class="text-uppercase">${activeBooking.status}</strong>
                </div>
                <div class="d-flex justify-content-between" style="font-size:0.75rem;">
                    <span class="text-muted">Estimasi Tunggu:</span>
                    <strong class="text-warning">15 Menit</strong>
                </div>
            </div>
            
            <button class="btn btn-outline-danger btn-sm w-100" onclick="cancelAndroidBooking('${activeBooking.id}')">Batalkan Antrean</button>
        </div>
    `;
}

function cancelAndroidBooking(bkgId) {
    if (confirm(`Batalkan reservasi ${bkgId}?`)) {
        const b = store.bookings.find(x => x.id === bkgId);
        if (b) {
            b.status = "Dibatalkan";
            saveToLocalStorage();
            showSuccessToast("Reservasi berhasil dibatalkan.");
            navigateAndroidUser("antrean");
        }
    }
}

function renderAndroidUserHistory(container) {
    const list = store.bookings.filter(b => b.customerEmail === store.activeUser.email);
    container.innerHTML = `
        <div class="p-3 animate-slide">
            <h5 class="fw-bold text-dark mb-3">Riwayat Pemesanan</h5>
            <div class="d-flex gap-1 mb-3">
                <span class="badge bg-dark text-white text-uppercase" style="font-size:0.55rem;">Semua (${list.length})</span>
            </div>
            ${list.map(b => {
                const srv = store.services.find(s => s.id === b.serviceId);
                let badge = "bg-warning";
                if (b.status === "Selesai") badge = "bg-success text-white";
                if (b.status === "Dibatalkan") badge = "bg-danger text-white";
                
                return `
                    <div class="card border-0 bg-white shadow-sm p-3 mb-2 rounded-3">
                        <div class="d-flex justify-content-between mb-1" style="font-size:0.75rem;">
                            <strong class="font-monospace text-dark">${b.id}</strong>
                            <span class="badge ${badge}" style="font-size:0.55rem;">${b.status}</span>
                        </div>
                        <div class="small fw-bold text-dark">${srv ? srv.name : 'Service'}</div>
                        <div class="d-flex justify-content-between mt-2 align-items-center" style="font-size:0.7rem;">
                            <span class="text-muted">${b.date} @ ${b.time}</span>
                            <strong class="text-dark">Rp ${b.price.toLocaleString('id-ID')}</strong>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderAndroidUserProfile(container) {
    container.innerHTML = `
        <div class="p-3 animate-slide text-center">
            <img src="${store.activeUser.avatar}" class="rounded-circle mb-2" style="width:75px; height:75px; object-fit:cover; border:3px solid var(--primary-light);">
            <h6 class="fw-bold mb-0 text-dark">${store.activeUser.name}</h6>
            <span class="badge bg-warning text-dark font-monospace mt-1 mb-3" style="font-size:0.6rem;">${store.activeUser.membership} Tier</span>
            
            <div class="card border-0 bg-white shadow-sm text-start p-3 rounded-3 mb-3">
                <h6 class="fw-bold text-dark mb-2" style="font-size:0.75rem;">Informasi Akun</h6>
                <div class="mb-2" style="font-size:0.7rem;">
                    <span class="text-muted d-block">WhatsApp HP:</span>
                    <strong class="text-dark">${store.activeUser.phone}</strong>
                </div>
                <div style="font-size:0.7rem;">
                    <span class="text-muted d-block">Alamat Email:</span>
                    <strong class="text-dark">${store.activeUser.email}</strong>
                </div>
            </div>
            
            <button class="btn btn-outline-danger btn-sm w-100" onclick="switchRole('public')">Keluar Akun</button>
        </div>
    `;
}


/* ======================================================== */
/* PHASE 2: ANDROID SIMULATOR LOGIC - STAFF / ADMIN APP     */
/* ======================================================== */
let androidAdminActiveTab = "home";

function navigateAndroidAdmin(tab) {
    androidAdminActiveTab = tab;
    
    const btns = document.querySelectorAll("#androidAdminBottomNav .phone-nav-btn, .mobile-bottom-nav .mobile-nav-btn");
    btns.forEach(b => {
        b.classList.remove("active");
        if (b.getAttribute("onclick") && b.getAttribute("onclick").includes(tab)) {
            b.classList.add("active");
        }
    });

    const screen = document.getElementById("androidAdminScreen");
    if (!screen) return;
    if (tab === "home") {
        renderAndroidAdminHome(screen);
    } else if (tab === "booking") {
        renderAndroidAdminBooking(screen);
    } else if (tab === "antrean") {
        renderAndroidAdminQueue(screen);
    } else if (tab === "laporan") {
        renderAndroidAdminLaporan(screen);
    } else if (tab === "profil") {
        renderAndroidAdminProfile(screen);
    }
}

function renderAndroidAdminHome(container) {
    const totalCount = store.bookings.length;
    const completed = store.bookings.filter(b => b.status === "Selesai");
    const totalRev = completed.reduce((sum, b) => sum + b.price, 0);

    container.innerHTML = `
        <div class="p-3 animate-slide">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-10 pb-2">
                <span class="fw-bold text-white small" style="letter-spacing:0.5px;">ADMIN PANEL MOBILE</span>
                <span class="badge bg-danger" style="font-size:0.55rem;">LIVE</span>
            </div>
            
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <div class="card bg-dark border border-secondary border-opacity-20 p-2 text-center">
                        <small class="text-white-50 d-block" style="font-size:0.6rem;">Bookings Hari Ini</small>
                        <h4 class="fw-bold mb-0 text-white font-monospace mt-1">${totalCount}</h4>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card bg-dark border border-secondary border-opacity-20 p-2 text-center">
                        <small class="text-white-50 d-block" style="font-size:0.6rem;">Pendapatan Hari Ini</small>
                        <h4 class="fw-bold mb-0 text-success font-monospace mt-1" style="font-size:1.1rem;">Rp ${totalRev.toLocaleString('id-ID')}</h4>
                    </div>
                </div>
            </div>
            
            <h6 class="fw-bold text-white-50 mb-2" style="font-size:0.8rem;">Ulasan Pelanggan Terakhir</h6>
            ${store.reviews.slice(0, 2).map(rev => `
                <div class="card bg-dark border border-secondary border-opacity-10 p-2 mb-2 rounded-3 text-start">
                    <div class="d-flex justify-content-between mb-1">
                        <strong class="text-white small" style="font-size:0.7rem;">${rev.name}</strong>
                        <span class="text-warning" style="font-size:0.6rem;"><i class="fas fa-star me-1"></i>${rev.rating}</span>
                    </div>
                    <p class="text-white-50 mb-0 text-truncate" style="font-size:0.65rem;">"${rev.comment}"</p>
                </div>
            `).join('')}
            
            <div class="card bg-warning bg-opacity-5 border border-warning border-opacity-20 p-3 mt-3 text-center">
                <h6 class="text-warning mb-1" style="font-size:0.75rem;"><i class="fas fa-bullhorn me-1"></i>Informasi Staf</h6>
                <small class="text-white-50" style="font-size:0.65rem;">Seluruh data sinkron instan ke TV Monitor dan Web.</small>
            </div>
        </div>
    `;
}

function renderAndroidAdminBooking(container) {
    container.innerHTML = `
        <div class="p-3 animate-slide">
            <h6 class="fw-bold text-white mb-3" style="font-size:0.9rem;">Reservasi Masuk</h6>
            
            ${store.bookings.slice(0, 6).map(b => {
                const srv = store.services.find(s => s.id === b.serviceId);
                
                let acts = "";
                if (b.status === "Menunggu") {
                    acts = `
                        <div class="d-flex gap-1 mt-2">
                            <button class="btn btn-xs btn-success w-50 py-1" onclick="updateAndroidAdminBookingStatus('${b.id}', 'Dikonfirmasi')"><i class="fas fa-check"></i> Setujui</button>
                            <button class="btn btn-xs btn-danger w-50 py-1" onclick="updateAndroidAdminBookingStatus('${b.id}', 'Dibatalkan')"><i class="fas fa-times"></i> Tolak</button>
                        </div>
                    `;
                }
                
                return `
                    <div class="card bg-dark border border-secondary border-opacity-10 p-2 mb-2 rounded-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="text-white font-monospace" style="font-size:0.75rem;">${b.id}</strong>
                            <span class="badge bg-secondary" style="font-size:0.55rem;">${b.status}</span>
                        </div>
                        <div class="text-white-50" style="font-size:0.7rem;">
                            <strong>${b.customerName}</strong> | ${srv ? srv.name : 'Service'}
                            <div class="small text-muted mt-1">${b.date} @ ${b.time}</div>
                        </div>
                        ${acts}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateAndroidAdminBookingStatus(bkgId, status) {
    updateBookingStatus(bkgId, status);
    navigateAndroidAdmin("booking");
}

function renderAndroidAdminQueue(container) {
    const bookingQueues = store.bookings
        .filter(b => b.status === "Menunggu" || b.status === "Dikonfirmasi" || b.status === "Sedang Dilayani")
        .map(b => ({ id: b.id, name: b.customerName, status: b.status, time: b.time, type: "Online" }));

    const walkinQueues = store.walkins
        .filter(w => w.status === "Menunggu" || w.status === "Sedang Dilayani")
        .map(w => ({ id: w.id, name: w.customerName, status: w.status, time: w.timeAdded, type: "Walk-in" }));

    const merged = [...bookingQueues, ...walkinQueues];
    merged.sort((x, y) => {
        if (x.status === "Sedang Dilayani" && y.status !== "Sedang Dilayani") return -1;
        if (x.status !== "Sedang Dilayani" && y.status === "Sedang Dilayani") return 1;
        return x.time.localeCompare(y.time);
    });

    container.innerHTML = `
        <div class="p-3 animate-slide">
            <h6 class="fw-bold text-white mb-3" style="font-size:0.9rem;">Antrean Aktif Real-Time</h6>
            
            ${merged.map((q, index) => {
                const isActive = q.status === "Sedang Dilayani";
                let actionBtn = "";
                if (!isActive) {
                    actionBtn = `<button class="btn btn-gold btn-xs py-1" onclick="callAndroidQueueNext('${q.id}', '${q.type}')">Panggil</button>`;
                } else {
                    actionBtn = `<button class="btn btn-success btn-xs py-1" onclick="completeAndroidQueueItem('${q.id}', '${q.type}')">Selesai</button>`;
                }
                
                return `
                    <div class="card bg-dark border border-secondary border-opacity-10 p-2 mb-2 rounded-3" style="${isActive ? 'border-color: var(--primary) !important;' : ''}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="d-flex align-items-center gap-1 mb-1">
                                    <strong class="text-white" style="font-size:0.75rem;">#${index+1} (${q.time})</strong>
                                    <span class="badge bg-secondary font-monospace" style="font-size:0.5rem;">${q.id}</span>
                                </div>
                                <div class="text-white-50" style="font-size:0.7rem;">${q.name} (${q.type})</div>
                            </div>
                            ${actionBtn}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function callAndroidQueueNext(id, type) {
    callQueueNext(id, type);
    navigateAndroidAdmin("antrean");
}

function completeAndroidQueueItem(id, type) {
    completeQueueItem(id, type);
    navigateAndroidAdmin("antrean");
}

function renderAndroidAdminLaporan(container) {
    const completed = store.bookings.filter(b => b.status === "Selesai");
    const totalRev = completed.reduce((sum, b) => sum + b.price, 0);

    container.innerHTML = `
        <div class="p-3 animate-slide">
            <h6 class="fw-bold text-white mb-3" style="font-size:0.9rem;">Laporan Ringkas</h6>
            
            <div class="card bg-dark border border-secondary border-opacity-10 p-3 mb-3 rounded-3 text-center">
                <small class="text-white-50 d-block" style="font-size:0.6rem;">Total Pendapatan Terkumpul</small>
                <h3 class="fw-bold text-success font-monospace my-1">Rp ${totalRev.toLocaleString('id-ID')}</h3>
                <small class="text-muted" style="font-size:0.65rem;">Terhitung dari ${completed.length} Reservasi Selesai</small>
            </div>
            
            <h6 class="fw-bold text-white-50 mb-2" style="font-size:0.75rem;">Performa Cabang</h6>
            <div class="card bg-dark border border-secondary border-opacity-15 p-2 rounded-3 text-start mb-2" style="font-size:0.7rem;">
                <div class="d-flex justify-content-between mb-1">
                    <span>Signature Cuts</span>
                    <strong class="text-white">60% Volume</strong>
                </div>
                <div class="progress" style="height:3px;">
                    <div class="progress-bar bg-warning" style="width:60%"></div>
                </div>
            </div>
            <div class="card bg-dark border border-secondary border-opacity-15 p-2 rounded-3 text-start" style="font-size:0.7rem;">
                <div class="d-flex justify-content-between mb-1">
                    <span>Creambath & Treatment</span>
                    <strong class="text-white">40% Volume</strong>
                </div>
                <div class="progress" style="height:3px;">
                    <div class="progress-bar bg-warning" style="width:40%"></div>
                </div>
            </div>
        </div>
    `;
}

function renderAndroidAdminProfile(container) {
    container.innerHTML = `
        <div class="p-3 animate-slide text-center">
            <img src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop" class="rounded-circle mb-2" style="width:65px; height:65px; object-fit:cover; border:2px solid var(--primary-light);">
            <h6 class="fw-bold mb-0 text-white">Administrator Super</h6>
            <span class="badge bg-danger mt-1 mb-3" style="font-size:0.55rem;">STAFF HUB Cabang Utama</span>
            
            <div class="card bg-dark border border-secondary border-opacity-10 text-start p-3 rounded-3 mb-3">
                <h6 class="fw-bold text-white mb-2" style="font-size:0.75rem;">Pengaturan Jam Buka</h6>
                <div class="mb-2" style="font-size:0.7rem; color:#9CA3AF;">
                    <span>Cabang Majestic Veteran:</span>
                    <strong class="text-white d-block">09:00 - 21:00 WIB</strong>
                </div>
            </div>
            
            <button class="btn btn-outline-danger btn-sm w-100" onclick="switchRole('public')">Keluar Aplikasi</button>
        </div>
    `;
}

// Binds new render sections in admin
const origRenderAdminActiveSection = renderAdminActiveSection;
renderAdminActiveSection = function(sectionId) {
    if (sectionId === "admin-laporan") {
        filterFinancials();
    } else if (sectionId === "admin-voucher") {
        renderAdminVoucherList();
    } else {
        origRenderAdminActiveSection(sectionId);
    }
}
