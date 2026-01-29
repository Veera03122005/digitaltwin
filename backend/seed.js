import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Bus from './models/Bus.js';
import Route from './models/Route.js';
import Trip from './models/Trip.js';
import connectDB from './config/database.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🌱 Connected to MongoDB...');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Bus.deleteMany({}),
            Route.deleteMany({}),
            Trip.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing data');

        // 1. Create Users
        const users = await User.create([
            { email: 'passenger@test.com', password: 'Test@123', fullName: 'Test Passenger', phone: '9876543210', role: 'passenger' },
            { email: 'admin@test.com', password: 'Admin@123', fullName: 'Test Admin', phone: '9876543211', role: 'admin' },
            { email: 'conductor@test.com', password: 'Conductor@123', fullName: 'Test Conductor', phone: '9876543212', role: 'conductor' }
        ]);
        console.log('✅ Users created');

        // 2. Create Buses
        const buses = await Bus.create([
            {
                registrationNumber: 'AP-01-AB-1234',
                model: 'Volvo 9400',
                capacity: 40,
                status: 'active',
                features: { hasAC: true, hasWifi: true, hasUSB: true }
            },
            {
                registrationNumber: 'AP-02-CD-5678',
                model: 'Ashok Leyland Viking',
                capacity: 50,
                status: 'active',
                features: { hasAC: false, hasWifi: false, hasUSB: false }
            },
            {
                registrationNumber: 'AP-03-EF-9012',
                model: 'Tata Marcopolo',
                capacity: 30,
                status: 'maintenance',
                features: { hasAC: true, hasWifi: false, hasUSB: true }
            },
            {
                registrationNumber: 'AP-04-GH-3456',
                model: 'Scania Metrolink',
                capacity: 45,
                status: 'active',
                features: { hasAC: true, hasWifi: true, hasUSB: true }
            }
        ]);
        console.log('✅ Buses created');

        // 3. Create Routes
        const routes = await Route.create([
            {
                name: 'City Connect',
                code: 'R-101',
                origin: 'City Center',
                destination: 'Airport',
                distance: 25,
                estimatedDuration: 60,
                baseFare: 50,
                stops: [
                    { name: 'City Center', sequence: 1, distanceFromOrigin: 0, estimatedArrival: 0 },
                    { name: 'Mall Junction', sequence: 2, distanceFromOrigin: 5, estimatedArrival: 15 },
                    { name: 'Tech Park', sequence: 3, distanceFromOrigin: 15, estimatedArrival: 35 },
                    { name: 'Airport', sequence: 4, distanceFromOrigin: 25, estimatedArrival: 60 }
                ]
            },
            {
                name: 'Suburb Express',
                code: 'R-202',
                origin: 'Railway Station',
                destination: 'North Suburb',
                distance: 15,
                estimatedDuration: 40,
                baseFare: 30,
                stops: [
                    { name: 'Railway Station', sequence: 1, distanceFromOrigin: 0, estimatedArrival: 0 },
                    { name: 'Market', sequence: 2, distanceFromOrigin: 4, estimatedArrival: 12 },
                    { name: 'University', sequence: 3, distanceFromOrigin: 8, estimatedArrival: 25 },
                    { name: 'North Suburb', sequence: 4, distanceFromOrigin: 15, estimatedArrival: 40 }
                ]
            }
        ]);
        console.log('✅ Routes created');

        // 4. Create Trips (Scheduled for tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0); // 8:00 AM

        const arrival1 = new Date(tomorrow);
        arrival1.setHours(9, 0, 0, 0); // 9:00 AM

        const tomorrow2 = new Date(tomorrow);
        tomorrow2.setHours(9, 0, 0, 0); // 9:00 AM launch

        const arrival2 = new Date(tomorrow2);
        arrival2.setMinutes(arrival2.getMinutes() + 40); // +40 mins

        const trips = await Trip.create([
            {
                routeId: routes[0]._id,
                busId: buses[0]._id,
                conductorId: users[2]._id,
                scheduledDeparture: tomorrow,
                scheduledArrival: arrival1,
                status: 'scheduled',
                availableSeats: buses[0].capacity
            },
            {
                routeId: routes[1]._id,
                busId: buses[1]._id,
                scheduledDeparture: tomorrow2,
                scheduledArrival: arrival2,
                status: 'scheduled',
                availableSeats: buses[1].capacity
            }
        ]);
        console.log('✅ Trips created');

        console.log('\n✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
