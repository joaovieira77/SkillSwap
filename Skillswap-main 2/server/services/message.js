const { ObjectId } = require("mongodb");
const { insertMessage, findMessagesBetweenUsers } = require("../data/messageData");

async function sendMessage(from, to, content) {
  return insertMessage({
    from: new ObjectId(from),
    to: new ObjectId(to),
    content,
    timestamp: new Date(),
  });
}

async function getConversation(user1, user2) {
  return findMessagesBetweenUsers(new ObjectId(user1), new ObjectId(user2));
}

module.exports = { sendMessage, getConversation };
