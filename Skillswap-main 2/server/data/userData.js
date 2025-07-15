// data/userData.js
const { GetCollection } = require("./mongodb");
const { ObjectId } = require("mongodb");

async function findUserByEmail(email) {
  const users = await GetCollection("users");
  return await users.findOne({ email });
}

async function findUserById(id) {
  const users = await GetCollection("users");
  return await users.findOne({ _id: new ObjectId(id) });
}

async function insertUser(userData) {
  const users = await GetCollection("users");
  const result = await users.insertOne(userData);
  return result.insertedId;
}

async function updateUserSkills(userId, offeredSkills, wantedSkills) {
  const users = await GetCollection("users");
  return await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { offeredSkills, wantedSkills } }
  );
}
async function updateUserProfile(userId, updates) {
  const users = await GetCollection("users");
  return users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updates }
  );
}


module.exports = {
  findUserByEmail,
  findUserById,
  insertUser,
  updateUserSkills,
  updateUserProfile,
};
