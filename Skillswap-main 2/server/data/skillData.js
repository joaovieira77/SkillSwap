const { GetCollection } = require("./mongodb");
const { ObjectId } = require('mongodb');

async function insertSkill(skill) {
  const skillsCollection = await GetCollection('skills');
  const result = await skillsCollection.insertOne(skill);
  return result.insertedId;
}

async function findSkillsByUser(userId) {
  const skillsCollection = await GetCollection('skills');
  return skillsCollection.find({ userId: new ObjectId(userId) }).toArray();
}

async function deleteSkill(skillId) {
  const skillsCollection = await GetCollection('skills');
  return skillsCollection.deleteOne({ _id: new ObjectId(skillId) });
}

module.exports = { insertSkill, findSkillsByUser, deleteSkill };