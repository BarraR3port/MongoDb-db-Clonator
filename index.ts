import { MongoClient } from 'mongodb';
const { MONGO_URI, SOURCE_DB, TARGET_DB } = process.env;

async function copyData() {
    const uri = MONGO_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado correctamente al servidor');

        const sourceDb = client.db(SOURCE_DB);
        const targetDb = client.db(TARGET_DB);

        const collections = await sourceDb.listCollections().toArray();

        for (const collection of collections) {
            const documents = await sourceDb.collection(collection.name).find().toArray();
            if (documents.length > 0) {
                await targetDb.collection(collection.name).insertMany(documents);
            }
        }
    } finally {
        await client.close();
    }
}

copyData().catch(console.error);