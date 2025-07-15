const {
  insertMatchRequest,
  updateMatchStatus,
  getMatchesForUser,
} = require('../data/matchData');

async function createMatch(user1, user2, skillFrom, skillTo) {
  return insertMatchRequest({
    user1,
    user2,
    skillFrom,
    skillTo,
    status: 'pending',
    createdAt: new Date()
  });
}

async function changeMatchStatus(matchId, status) {
  return updateMatchStatus(matchId, status);
}

async function fetchMatchesForUser(userId) {
  return getMatchesForUser(userId);
}

module.exports = {
  createMatch,
  changeMatchStatus,
  fetchMatchesForUser, 
};
