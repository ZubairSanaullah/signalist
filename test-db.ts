import { connectToDatabase } from './database/mongoose';

async function testConnection() {
    try {
        await connectToDatabase();
        console.log('Database connection test successful!');
    } catch (error) {
        console.error('Database connection test failed:', error.message);
    }
}

testConnection();</content>
<parameter name="filePath">e:\FullStack\signalist\test-db.mjs