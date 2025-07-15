const { GetCollection } = require('./mongodb');
const { ObjectId } = require('mongodb');

/**
 * New match in the database
 */
async function insertMatchRequest(matchData) {
  const matches = await GetCollection('matches');
  return matches.insertOne(matchData);
}

/**
 * refreshes the status of a match
 */
async function updateMatchStatus(matchId, status) {
  if (!ObjectId.isValid(matchId)) {
    throw new Error("ID de match inválido");
  }
  const matches = await GetCollection('matches');
  return matches.updateOne(
    { _id: new ObjectId(matchId) },
    { $set: { status } }
  );
}

/**
 * finds all matches for a user
 */
async function getMatchesForUser(userId) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("ID de utilizador inválido");
  }
  const matches = await GetCollection('matches');
  return matches.find({
    $or: [
      { user1: new ObjectId(userId) },
      { user2: new ObjectId(userId) },
    ],
  }).toArray();
}

module.exports = {
  insertMatchRequest,
  updateMatchStatus,
  getMatchesForUser,
};
