const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB... (URI Length: ${uri ? uri.length : 'undefined'})`);

    if (!uri) {
        console.error('❌ MONGO_URI is missing in environment variables!');
        console.error('⚠️ Server will start but database features will not work.');
        return false;
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        console.error('⚠️ Server will continue running. Database will retry on next request.');
        isConnected = false;
        return false;
    }
};

// Non-blocking connection for server startup
const connectDBAsync = () => {
    if (!connectionPromise) {
        connectionPromise = connectDB();
    }
    return connectionPromise;
};

// Check if database is connected
const isDBConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.connectDBAsync = connectDBAsync;
module.exports.isDBConnected = isDBConnected;
