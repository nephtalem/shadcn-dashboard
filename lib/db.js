import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  try {
    console.log("⏳ Connecting to MongoDB...");

    const client = await MongoClient.connect(
      "mongodb+srv://naph:naph@cluster0.en6dj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("✅ Successfully connected to MongoDB!");

    return client;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}
