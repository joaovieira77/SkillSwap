const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const userService = require("./services/userService");
const skillService = require("./services/skill");
const matchService = require("./services/matchService");
const messageService = require("./services/message");
const { GetCollection } = require("./data/mongodb");

const app = express();
const PORT = process.env.PORT || 3034;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

/* ---------------------- AUTH ---------------------- */

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, location } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !location) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match." });
  }

  try {
    const userId = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      location,
    });
    res.json({ userId });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userId = await userService.loginUser({ email, password });
    res.json({ userId });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/* ---------------------- USERS ---------------------- */

app.get("/users/:id", async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/users/update-profile", async (req, res) => {
  const { userId, firstName, lastName, location, offeredSkills, wantedSkills } = req.body;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    await userService.updateUserProfile(userId, {
      firstName,
      lastName,
      location,
      offeredSkills,
      wantedSkills,
    });

    res.json({ message: "Profile successfully updated " });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err.message);
    res.status(500).json({ error: "Error" });
  }
});

app.get("/api/all-users", async (req, res) => {
  try {
    const users = await GetCollection("users");
    const all = await users.find().toArray();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar utilizadores" });
  }
});

/* ---------------------- SKILLS ---------------------- */

app.post("/skills", async (req, res) => {
  try {
    const id = await skillService.addSkill(req.body);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to add skill" });
  }
});

app.get("/skills/:userId", async (req, res) => {
  try {
    const skills = await skillService.getSkillsForUser(req.params.userId);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user skills" });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const skillsCollection = await GetCollection("skills");
    const skills = await skillsCollection.find().toArray();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch available skills" });
  }
});

/* ---------------------- MATCHES / SWAPS ---------------------- */

app.post("/matches", async (req, res) => {
  const { userId, skillFrom, skillTo } = req.body;

  if (!userId || !skillFrom || !skillTo) {
    return res.status(400).json({ error: "Incomplete data" });
  }

  try {
    const matches = await GetCollection("matches");

    const result = await matches.insertOne({
  user1: new ObjectId(userId),
  skillFrom,
  skillTo,
  status: "open",
  createdAt: new Date(),
});


    res.json({ message: "Swap created successfully", id: result.insertedId });
  } catch (err) {
    console.error("Erro ao criar swap:", err.message);
    res.status(500).json({ error: "Error creating swap" });
  }
});

app.get("/api/swaps/:skill", async (req, res) => {
  const skill = req.params.skill;

  try {
    const matches = await GetCollection("matches");
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const swaps = await matches.find({
  skillTo: { $regex: `^${escapeRegex(skill)}$`, $options: "i" },
  status: "open"
}).toArray();

    res.json(swaps);
  } catch (err) {
    console.error("Erro ao buscar swaps:", err.message);
    res.status(500).json({ error: "Erro ao buscar swaps" });
  }
});
app.get("/matches/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const matches = await GetCollection("matches");

    const userSwaps = await matches
      .find({
        $or: [
          { user1: new ObjectId(userId) },
          { user2: new ObjectId(userId) },
        ],
      })
      .toArray();

    res.json(userSwaps);
  } catch (err) {
    console.error("Erro ao buscar swaps do utilizador:", err.message);
    res.status(500).json({ error: "Erro ao buscar swaps do utilizador" });
  }
});
app.post("/api/swaps/accept/:id", async (req, res) => {
  const { user2 } = req.body;
  const swapId = req.params.id;

  if (!user2) return res.status(400).json({ error: "Missing user2" });

  try {
    const matches = await GetCollection("matches");
    const swap = await matches.findOne({ _id: new ObjectId(swapId) });

if (!swap) {
  return res.status(404).json({ error: "Swap not found" });
}

if (swap.user1.toString() === user2) {
  return res.status(400).json({ error: "Não podes aceitar o teu próprio swap" });
}


    const result = await matches.updateOne(
      { _id: new ObjectId(swapId), status: "open" },
      {
        $set: {
          user2: new ObjectId(user2),
          status: "matched",
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Swap not found or already matched" });
    }

    res.json({ message: "Swap accepted!" });
  } catch (err) {
    console.error("Erro ao aceitar swap:", err.message);
    res.status(500).json({ error: "Erro ao aceitar swap" });
  }
});



app.post("/api/match-requests", async (req, res) => {
  const { swapId, user2 } = req.body;

  if (!swapId || !user2) {
    return res.status(400).json({ error: "Missing swapId or user2" });
  }

  try {
    const matches = await GetCollection("matches");
    const swap = await matches.findOne({ _id: new ObjectId(swapId) });

    if (!swap) {
      return res.status(404).json({ error: "Swap not found" });
    }

    if (swap.user1.toString() === user2) {
      return res.status(400).json({ error: "Can't swap yourself." });
    }

    const matchRequests = await GetCollection("matchRequests");

    const existing = await matchRequests.findOne({
      swapId: new ObjectId(swapId),
      user2: new ObjectId(user2),
      status: "pending",
    });

    if (existing) {
      return res.status(409).json({ error: "You've already sent a swap." });
    }

    const result = await matchRequests.insertOne({
      swapId: new ObjectId(swapId),
      user1: swap.user1,
      user2: new ObjectId(user2),
      skillFrom: swap.skillFrom,
      skillTo: swap.skillTo,
      status: "pending",
      createdAt: new Date(),
    });

    res.json({ message: "Swap sent", id: result.insertedId });
  } catch (err) {
    console.error("Error creating match:", err.message);
    res.status(500).json({ error: "Error creating match" });
  }
});

app.get("/api/match-requests/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const matchRequests = await GetCollection("matchRequests");
    const requests = await matchRequests
      .find({ user1: new ObjectId(userId), status: "pending" })
      .toArray();

    res.json(requests);
  } catch (err) {
    console.error("Erro ao buscar pedidos de match:", err.message);
    res.status(500).json({ error: "Erro ao buscar pedidos de match" });
  }
});


app.post("/api/match-requests/:id/accept", async (req, res) => {
  const requestId = req.params.id;

  try {
    const matchRequests = await GetCollection("matchRequests");
    const request = await matchRequests.findOne({ _id: new ObjectId(requestId) });

    if (!request) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const matches = await GetCollection("matches");

    await matches.updateOne(
      { _id: request.swapId },
      {
        $set: {
          user2: request.user2,
          status: "matched",
        },
      }
    );

    await matchRequests.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "accepted" } }
    );

    res.json({ message: "Pedido aceite e swap atualizado" });
  } catch (err) {
    console.error("Erro ao aceitar pedido:", err.message);
    res.status(500).json({ error: "Erro ao aceitar pedido" });
  }
});

app.post("/api/match-requests/:id/reject", async (req, res) => {
  const requestId = req.params.id;

  try {
    const matchRequests = await GetCollection("matchRequests");
    const result = await matchRequests.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "rejected" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Pedido não encontrado ou já rejeitado" });
    }

    res.json({ message: "Pedido rejeitado" });
  } catch (err) {
    console.error("Erro ao rejeitar pedido:", err.message);
    res.status(500).json({ error: "Erro ao rejeitar pedido" });
  }
});




/* ---------------------- MESSAGES ---------------------- */

app.post("/messages", async (req, res) => {
  try {
    const { from, to, content } = req.body;
    const result = await messageService.sendMessage(from, to, content);
    // result is the insertOne result, so return the inserted message with _id
    res.json({
      from,
      to,
      content,
      timestamp: result.ops ? result.ops[0].timestamp : new Date(),
      _id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});


app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const messages = await messageService.getConversation(
      req.params.user1,
      req.params.user2
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/api/all-swaps", async (req, res) => {
  try {
    const matches = await GetCollection("matches");
    const all = await matches.find().toArray();
    res.json(all);
  } catch (err) {
    console.error("Erro ao buscar swaps:", err.message);
    res.status(500).json({ error: "Erro ao buscar swaps" });
  }
});
app.delete("/api/swaps/:id", async (req, res) => {
  try {
    const matches = await GetCollection("matches");
    const result = await matches.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Swap não encontrado" });
    }

    res.json({ message: "Swap eliminado com sucesso" });
  } catch (err) {
    console.error("Erro ao eliminar swap:", err.message);
    res.status(500).json({ error: "Erro ao eliminar swap" });
  }
});


/* ---------------------- SERVER ---------------------- */

app.listen(PORT, () => {
  console.log(`URWA running on port ${PORT}`);
});
