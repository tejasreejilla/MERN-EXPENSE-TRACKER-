import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixUserIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the problematic username_1 index if it exists
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  username_1 index does not exist');
      } else {
        console.log('Error dropping index:', error.message);
      }
    }

    // Remove any documents with null username field
    const result = await usersCollection.updateMany(
      { username: { $exists: true } },
      { $unset: { username: '' } }
    );
    console.log(`✅ Removed username field from ${result.modifiedCount} documents`);

    console.log('\n✅ Database cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixUserIndex();
