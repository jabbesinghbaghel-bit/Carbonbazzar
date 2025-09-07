import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// Safety check: make sure the environment variable is set
if (!uri) {
  throw new Error("Please define MONGODB_URI in your Vercel Environment Variables");
}

// Handle dev vs prod
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// ✅ Only ONE default export
export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("carbonbazzar"); // use your DB name
    const collections = await db.listCollections().toArray();

    res.status(200).json({
      success: true,
      collections: collections.map((col) => col.name),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
