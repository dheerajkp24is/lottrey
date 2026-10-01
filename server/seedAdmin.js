const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const username = 'admin';
    const email = 'admin@lottery.com';
    const password = 'admin12345';

    const existing = await Admin.findOne({ $or: [{ username }, { email }] });

    if (existing) {
      console.log('⚠️  Admin already exists. Resetting password...');
      existing.password = password;
      await existing.save();
      console.log('✅ Password reset successfully!');
    } else {
      await Admin.create({ username, email, password });
      console.log('✅ Admin created successfully!');
    }

    console.log('\n========================================');
    console.log('  🔑 ADMIN LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('  Username : admin');
    console.log('  Email    : admin@lottery.com');
    console.log('  Password : admin12345');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();