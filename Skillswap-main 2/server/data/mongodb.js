const { MongoClient } = require("mongodb") ;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const defaultDbName = "Skillswap";

let client = undefined


async function GetMongoClient() {
    if (!client) {
        try {
            client = await MongoClient.connect(url);
        } catch (err) {
            console.error(err);
        }
    }
    return client;
}

async function CloseConnection() {
    const client = await GetMongoClient()
    console.log(client)
    return await client.close();
}

async function GetCollection(collectionName) {
    const cli = await GetMongoClient();
    const db = cli.db(defaultDbName);
    return db.collection(collectionName);
}

module.exports = {CloseConnection, GetCollection}