import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Failed:');
        console.error('Error:', error.message);
        console.error('\nPlease check:');
        console.error('1. Username and password are correct');
        console.error('2. User has proper permissions in MongoDB Atlas');
        console.error('3. Your IP is whitelisted in Network Access');
        process.exit(1);
    });
