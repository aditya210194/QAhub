const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI|| 'mongodb://127.0.0.1:27017/contact-form';
        if (!mongoURI) {
            throw new Error('Mongo URI is not defined');
        }
        console.log(`Mongo URI: ${mongoURI}`); // Log the URI for debugging
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
