import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("carbonbazzar"); // database name
    const collections = await db.listCollections().toArray();
    res.status(200).json({ success: true, collections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
