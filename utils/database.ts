import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global as any;

if (!cached.mongo) {
  cached.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.mongo.conn) {
    return cached.mongo.conn;
  }

  if (!cached.mongo.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.mongo.promise = MongoClient.connect(MONGODB_URI!, opts).then((client) => {
      console.log('New database connection established');
      return {
        client,
        db: client.db(),
      };
    }).catch((error) => {
      console.error('Failed to connect to database:', error);
      throw error;
    });
  }

  try {
    cached.mongo.conn = await cached.mongo.promise;
  } catch (e) {
    cached.mongo.promise = null;
    throw e;
  }

  return cached.mongo.conn;
}
