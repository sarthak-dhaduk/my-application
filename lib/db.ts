import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client) {
    return { client, db: client.db() };
  }

  if (!clientPromise) {
    client = new MongoClient(uri!);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  client = connectedClient;
  return { client: connectedClient, db: connectedClient.db() };
}
