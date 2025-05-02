import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import { config } from './config'

// Use the MONGO_URI from config instead of hardcoded URI
const uri = config.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Always enable SSL for MongoDB Atlas connections
  ssl: true,
  // Add connection timeout and retry options
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
})

// Configure Mongoose settings
mongoose.set('strictQuery', false)

export const connectDB = async (): Promise<void> => {
  try {
    // Connect the MongoDB native client first
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB Native Client Connected!')
    
    // Then connect Mongoose with proper timeout settings
    const mongooseConnection = await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
    })
    
    // Set the global buffering timeout for Mongoose operations
    mongoose.set('bufferCommands', true);
    mongoose.set('bufferTimeoutMS', 30000);
    
    // Verify database connection
    const db = mongooseConnection.connection;
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      if (config.NODE_ENV === 'production') {
        process.exit(1);
      }
    });

    db.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    db.on('reconnected', () => {
      console.info('MongoDB reconnected!');
    });
    
    console.log('Mongoose Connected: You successfully connected to MongoDB!')
    console.log(`Using MongoDB URI: ${uri.replace(/:[^:]*@/, ':****@')}`)

    // Verify we can perform database operations
    await db.collection('test').findOne({});
    console.log('Successfully verified database operations');
  } catch (error) {
    console.error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    console.error(
      'Please check your MongoDB connection string and ensure the MongoDB service is running.'
    )
    // Always exit on connection failure to prevent silent failures
    process.exit(1);
  }
}

// Export the MongoDB client for use in other parts of the application
export const getClient = () => client
