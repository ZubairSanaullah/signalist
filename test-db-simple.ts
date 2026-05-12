import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connection test successful!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Database connection test failed:', error.message);
    }
}

testConnection();