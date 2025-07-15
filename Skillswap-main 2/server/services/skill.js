const { insertSkill, findSkillsByUser, deleteSkill } = require('../data/skillData');

async function addSkill(skillData) {
  return insertSkill(skillData);
}

async function getSkillsForUser(userId) {
  return findSkillsByUser(userId);
}

async function removeSkill(skillId) {
  return deleteSkill(skillId);
}

module.exports = { addSkill, getSkillsForUser, removeSkill };
