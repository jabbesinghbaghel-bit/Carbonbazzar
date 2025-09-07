import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please define MONGODB_URI in Vercel Environment Variables");
}

if (process.env.NODE_ENV === "development") {
  // Use a global variable in dev to prevent creating many clients
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // New client for production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("carbonbazzar"); // database name
    const collections = await db.listCollections().toArray();
    res.status(200).json({ success: true, collections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
