const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log(`Connecting to MongoDB... (URI Length: ${uri ? uri.length : 'undefined'})`);

        if (!uri) {
            console.error('❌ MONGO_URI is missing in environment variables!');
            throw new Error('MONGO_URI missing');
        }

        const conn = await mongoose.connect(uri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;
