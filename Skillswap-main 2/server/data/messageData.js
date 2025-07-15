const { ObjectId } = require("mongodb");
const { GetCollection } = require("./mongodb");

async function insertMessage(message) {
  const messages = await GetCollection("messages");
  return messages.insertOne(message);
}

async function findMessagesBetweenUsers(user1, user2) {
  const messages = await GetCollection("messages");
  return messages
    .find({
      $or: [
        // ObjectId match
        { from: new ObjectId(user1), to: new ObjectId(user2) },
        { from: new ObjectId(user2), to: new ObjectId(user1) },
        // String match
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    })
    .sort({ timestamp: 1 })
    .toArray();
}

module.exports = { insertMessage, findMessagesBetweenUsers };
