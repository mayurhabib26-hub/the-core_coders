require('dotenv').config(); // 1. Load environment variables FIRST
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit'); // For rate limiting

// 1. App Setup
const app = express();

// 2. Security Middleware Setup
// 2.1 CORS Config: Only allow my frontend (or fallback to '*' if dev)
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());

// 2.2 Rate Limiter: Max 100 requests per 15 mins per IP (Disabled for Local Dev)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting if the request is coming from localhost (developer machine)
        const ip = req.ip || req.connection.remoteAddress;
        return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
    }
});
app.use(limiter); // Apply limiter globally

// 2.3 Custom API Key Middleware
// Every request to /api/* must have an 'x-api-key' header matching our .env secret
const verifyApiKey = (req, res, next) => {
    // Skip verification for the root status check
    if (req.path === '/') return next();

    const clientApiKey = req.headers['x-api-key'];
    const serverApiKey = process.env.SECRET_API_KEY;

    if (!clientApiKey || clientApiKey !== serverApiKey) {
        console.warn(`⚠️ Blocked unauthorized request to ${req.path}`);
        return res.status(401).json({ error: "Unauthorized: Invalid or missing x-api-key" });
    }
    next(); // Key matches, proceed to the requested route
};

// Apply the API key middleware to ALL /api/ routes
app.use('/api', verifyApiKey);


// 3. Firebase Database Connection
// Dhyan rahe: 'serviceAccountKey.json' is folder mein honi chahiye!
let db = null;
try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase connected successfully! ✅");
} catch (error) {
    console.log("⚠️ Firebase key missing. Make sure serviceAccountKey.json is in the folder. APIs will still run in mock mode.");
}

// 4. Serve Frontend Static Files
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));


// ==========================================
// --- API ROUTES ---
// ==========================================

// Route 1: Status Check (Moved from / to /api/status so HTML can load)
app.get('/api/status', (req, res) => {
    res.send({ status: "AgriSwap Secure Backend is LIVE! 🚀", secure: true });
});

// Route 2: Live Market Rates
app.get('/api/market/rates', (req, res) => {
    const mockRates = [];
    res.status(200).json(mockRates);
});

// Route 3: Get Barter Posts (Firebase)
app.get('/api/barter/list', async (req, res) => {
    try {
        if (!db) throw new Error("Database not connected. Provide Firebase credentials.");
        const snapshot = await db.collection('barter_posts').get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 4: Verify Google Firebase Token
app.post('/api/auth/google', async (req, res) => {
    const { idToken, role } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: "Missing Firebase ID Token" });
    }

    try {
        // Verify the token using Firebase Admin SDK securely
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // At this point, the user is 100% verified. 
        // We simulate logging them in by issuing a mock native token to use with our other APIs.
        const mockServerToken = "secure-jwt-token-" + uid;

        res.status(200).json({
            message: "Authentication successful",
            token: mockServerToken,
            user: {
                id: uid,
                email: email,
                name: name || email?.split('@')[0] || "Farmer",
                photoURL: picture,
                role: role || 'farmer'
            }
        });

    } catch (error) {
        console.error("Firebase Token Verification Failed:", error);
        res.status(401).json({ error: "Unauthorized: Invalid or expired Google Token" });
    }
});


// Route 4.1: Mock Register Route
app.post('/api/auth/register', (req, res) => {
    const { name, phone, password, role, district, state, pincode } = req.body;

    if (!phone || !password || !name) {
        return res.status(400).json({ error: "Name, phone, and password are required" });
    }

    const mockUid = "mock-user-" + Date.now();
    res.status(200).json({
        message: "Registration successful",
        token: "secure-jwt-token-" + mockUid,
        user: { id: mockUid, name, phone, role: role || 'farmer', district, state, pincode }
    });
});

// Route 4.2: Mock Login Route
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    // In auth.js, the phone might be sent during login if we switched back, but auth.js sends email for login.
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const mockUid = "mock-user-" + Date.now();
    res.status(200).json({
        message: "Login successful",
        token: "secure-jwt-token-" + mockUid,
        user: { id: mockUid, name: email.split('@')[0], email, role: role || 'farmer' }
    });
});

// ==========================================
// --- NEW MOCK ROUTES FOR FRONTEND ACTIONS ---
// ==========================================

const multer = require('multer');
const upload = multer({ dest: 'public/images/' });

// 1. Listings
let mockListings = []; // Resetting database for a fresh start

app.post('/api/listings', upload.single('image'), (req, res) => {
    // In a real app, we'd get this from `req.headers.authorization` JWT.
    // For this mock, we append a simulated owner object so it doesn't show "Unknown".
    const fallbackName = req.body.ownerName && req.body.ownerName !== 'undefined' ? req.body.ownerName : "Farmer";
    const owner = {
        name: fallbackName,
        rating: 5.0
    };

    const newListing = {
        ...req.body,
        id: 'list-' + Date.now(),
        createdAt: new Date().toISOString(),
        imageUrl: req.file ? '/images/' + req.file.filename : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop',
        owner: owner,
        ownerId: req.body.ownerId || 'u1', // Default to u1 if not provided
        location: { district: req.body.district || 'India' }
    };
    mockListings.push(newListing);
    res.status(201).json(newListing);
});

app.get('/api/listings', (req, res) => {
    // PUBLIC BROWSE: Show everyone's listings EXCEPT the logged-in user's own items
    const ownerId = req.headers['x-user-id'] || 'anonymous';
    let filteredListings = mockListings.filter(l => l.ownerId !== ownerId);

    // Filter by search query (title, description, category, district)
    if (req.query.search) {
        const q = req.query.search.toLowerCase();
        filteredListings = filteredListings.filter(l =>
            (l.title && l.title.toLowerCase().includes(q)) ||
            (l.description && l.description.toLowerCase().includes(q)) ||
            (l.category && l.category.toLowerCase().includes(q)) ||
            (l.location && l.location.district && l.location.district.toLowerCase().includes(q))
        );
    }

    // Filter by category
    if (req.query.category) {
        const cats = req.query.category.split(',').map(c => c.trim().toLowerCase());
        filteredListings = filteredListings.filter(l => cats.includes(l.category.toLowerCase()));
    }

    // Filter by district
    if (req.query.district) {
        const d = req.query.district.toLowerCase();
        filteredListings = filteredListings.filter(l =>
            l.location && l.location.district && l.location.district.toLowerCase().includes(d)
        );
    }

    res.status(200).json(filteredListings);
});

app.get('/api/listings/me', (req, res) => {
    // In this mock, we lookup by ownerId passed in headers or query
    const ownerId = req.headers['x-user-id'] || req.query.ownerId || 'u1';
    const myListings = mockListings.filter(l => l.ownerId === ownerId);
    res.status(200).json({
        listings: myListings
    });
});

app.get('/api/listings/:id', (req, res) => {
    const listing = mockListings.find(l => l.id === req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(listing);
});

// 2. Exchanges / Barter Proposals
let mockExchanges = [];
app.post('/api/exchanges/propose', (req, res) => {
    const newEx = {
        id: 'ex-' + Date.now(),
        ...req.body,
        status: 'pending'
    };
    mockExchanges.push(newEx);
    res.status(201).json(newEx);
});

// 3. AI Photo Detection / Valuation
app.post('/api/valuation/estimate', upload.single('image'), (req, res) => {
    // Dynamic mock response for AI quality check based on random calculation to simulate real AI evaluation
    const grades = ['A+', 'A', 'B+', 'B', 'C'];
    const messages = [
        "AI detected high-quality crop with no diseases. Excellent freshness.",
        "Good quality with minor visual imperfections detected. Suitable for premium barter.",
        "Average quality. Moisture content appears slightly high.",
        "Detected slight discoloration. Ensure proper storage.",
        "Standard quality crop. Fits general market standards."
    ];

    // Create random but realistic-looking results
    const randIndex = Math.floor(Math.random() * 3); // Favors better grades for demo
    const randomGrade = grades[randIndex];
    const randomScore = Math.floor(Math.random() * (98 - 80 + 1) + 80); // 80-98 score
    const dummyPrice = Math.floor(Math.random() * (6000 - 1500 + 1) + 1500);

    res.status(200).json({
        grade: randomGrade,
        estimatedValue: `₹${dummyPrice}`,
        message: messages[randIndex],
        score: randomScore
    });
});

// 4. User Profile
app.get('/api/users/:id/profile', (req, res) => {
    res.status(200).json({
        id: req.params.id,
        name: "Farmer",
        role: "farmer",
        location: "India",
        phone: "",
        stats: { listings: 0, exchanges: 0, rating: 5.0 }
    });
});

// ==========================================
// --- NEW: OFFLINE SMS & LOCALIZATION APIS ---
// ==========================================

// Route 4: Offline SMS Command Parser (Mock)
// Handles incoming offline SMS requests (e.g. "RATE WHEAT")
app.post('/api/offline/sms-sync', (req, res) => {
    // Expected Payload: { phoneNumber: "+919876543210", message: "RATE WHEAT" }
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: "phoneNumber and message are required" });
    }

    const command = message.toUpperCase().trim();
    let reply = "Invalid SMS command. Send 'RATES', 'MATCH', or 'HELP'.";

    if (command.startsWith("RATE ")) {
        reply = `Market update: Information for ${command.split(" ")[1]} is currently unavailable.`;
    } else if (command === "RATES") {
        reply = "Current Rates: No active rates available. Reply 'MATCH' to see barter offers.";
    } else if (command === "MATCH") {
        reply = "No matches found near you. Reply 'HELP' for more options.";
    } else if (command.startsWith("ACCEPT ")) {
        reply = `Deal accepted with ${command.split(" ")[1]}! They have been notified.`;
    }

    console.log(`📩 Processed SMS from ${phoneNumber}. Reply sent: ${reply}`);

    // Simulate sending an SMS response back
    res.status(200).json({
        status: "success",
        smsReplySent: reply,
        creditsRemaining: 98
    });
});

// Route 5: Language Resource Localization (Mock)
// Returns dictionary translations based on requested language code (en, mr, kn)
app.get('/api/localization', (req, res) => {
    const { lang } = req.query; // ?lang=mr
    const languageCode = lang || 'en'; // default to english

    const translations = {
        'en': { // English (Default)
            "welcome": "Welcome to AgriSwap",
            "marketRates": "Live Mandi Rates",
            "smartMatches": "Smart Barter Matches",
            "postRequest": "Post Barter Request",
            "aiCheck": "AI Crop Quality Check",
            "offlineSms": "SMS Offline Sync",
            "crop": "Crop",
            "price": "Price",
            "acceptDeal": "Accept Deal"
        },
        'mr': { // Marathi
            "welcome": "AgriSwap मध्ये आपले स्वागत आहे",
            "marketRates": "थेट बाजार भाव (मंडी)",
            "smartMatches": "स्मार्ट बार्टर सामने",
            "postRequest": "बार्टर विनंती पोस्ट करा",
            "aiCheck": "लागवड गुणवत्ता तपासणी (AI)",
            "offlineSms": "एसएमएस ऑफलाइन सिंक",
            "crop": "पीक",
            "price": "किंमत",
            "acceptDeal": "करार स्वीकारा"
        },
        'kn': { // Kannada
            "welcome": "AgriSwap ಗೆ ಸುಸ್ವಾಗತ",
            "marketRates": "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರಗಳು",
            "smartMatches": "ಸ್ಮಾರ್ಟ್ ಬಾರ್ಟರ್ ಹೊಂದಾಣಿಕೆಗಳು",
            "postRequest": "ಬಾರ್ಟರ್ ವಿನಂತಿಯನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ",
            "aiCheck": "ಎಐ ಬೆಳೆ ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ",
            "offlineSms": "SMS ಆಫ್‌ಲೈನ್ ಸಿಂಕ್",
            "crop": "ಬೆಳೆ",
            "price": "ಬೆಲೆ",
            "acceptDeal": "ಒಪ್ಪಂದವನ್ನು ಸ್ವೀಕರಿಸಿ"
        }
    };

    if (!translations[languageCode]) {
        return res.status(400).json({ error: `Language '${languageCode}' not supported. Try 'en', 'mr', or 'kn'.` });
    }

    res.status(200).json({
        language: languageCode,
        data: translations[languageCode]
    });
});


// ==========================================
// 4. Engine Start
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🛡️  SERVER SECURITY ACTIVATED`);
    console.log(`   - Rate Limiting: Max 100 req / 15 mins via express-rate-limit`);
    console.log(`   - CORS Restricted: ${process.env.FRONTEND_URL || '*'}`);
    console.log(`   - Auth: Custom API Key (x-api-key header) strictly enforced on /api/*`);
    console.log(`   - Firebase: ${db ? 'Connected' : 'Missing serviceAccountKey.json'}`);
    console.log(`\n🔥 Secure Backend is running on http://localhost:${PORT}`);
});
