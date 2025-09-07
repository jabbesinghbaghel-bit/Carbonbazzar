import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("mongodb+srv://CarbonAdmin:<Anshul@1246>@cluster0.cgkswhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

if (process.env.NODE_ENV === "development") {
  // In dev, use global to avoid multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection
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

