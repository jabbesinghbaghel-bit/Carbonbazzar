import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("carbonDB");   // your database name
    const collection = db.collection("testCollection");

    // Insert a test document
    await collection.insertOne({ message: "Hello Carbon Bazaar!" });

    // Fetch all documents
    const data = await collection.find({}).toArray();

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database connection failed" });
  }
}
