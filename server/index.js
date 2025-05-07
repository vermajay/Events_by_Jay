import express from "express";
import path from "path";

//so that the backend(PORT:4000) can entertain the requests made by frontend(PORT:5173) on the same local machine
import cors from "cors";  
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { dbConnect } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

import adminRoutes from "./routes/admin.route.js";
import eventRoutes from "./routes/event.route.js";
import formResponseRoutes from "./routes/formResponse.route.js";

const app = express();

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 4000;

// Database connection
dbConnect();

// Cloudinary connection
cloudinaryConnect();

// Set correct MIME types, especially for JS modules
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (path.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
  
// Add CORS headers to allow your Netlify frontend to access the backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://eventsease.netlify.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*", // Allow requests from any origin
        credentials: true, // Allow cookies and auth headers
        methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);

// Mount routes
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/form-responses", formResponseRoutes);

// Default route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Your server is up and running....",
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
});