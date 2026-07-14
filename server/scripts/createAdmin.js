const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = 'admin@qahub.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const admin = new User({
            username: 'admin',
            fullName: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'Admin',
            isActive: true
        });

        await admin.save();
        console.log('✅ Admin created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: Admin@123`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();