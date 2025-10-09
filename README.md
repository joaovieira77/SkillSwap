# 🧠 SkillSwap — Skill Exchange Platform

SkillSwap is a full-stack web application that enables users to exchange skills directly and personally.

- This project was developed as part of the final project for the Bytes4Future training program.

---

## 👥 Project Members

|   | Name   | Role                        | GitHub Username                          |
|---|--------|-----------------------------|-------------------------------------------|
| 🪄 | João   | Backend & Frontend          | [@joaovieira77](https://github.com/joaovieira77) |
| 💎 | Hania  | Frontend                    | [@HaniaA4](https://github.com/HaniaA4)           |
| ☺️ | Arwa   | Frontend & UX/UI            | [@arwaaziz32](https://github.com/arwaaziz32)     |
| 🌍 | Pedro  | Design                      | —                                         |





## 🌐 Overview

SkillSwap consists of two main components:

- **Frontend**: Built with React, providing a responsive and user-focused interface.
- **Backend**: Built with Node.js and Express, connected to MongoDB using the native driver. Also includes a WebRTC signaling server for video calls.

---

## ⚙️ Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Frontend     | React, Axios, React Router             |
| Backend      | Node.js, Express, MongoDB              |
| Styling      | Tailwind CSS / CSS Modules             |
| Real-Time    | Socket.IO (messaging and video calls)  |

---

## 🧩 Core Features

### 👥 Profiles and Skills

- Add skills users can teach and those they want to learn
- Matchmaking based on skill compatibility

### 🔁 Swap Requests

- Send, accept or reject swap requests

### 💬 Messaging

- Real-time chat between users
- Notifications for new messages

### 📹 Video Calls

- Peer-to-peer video calls via WebRTC
- Signaling handled via Socket.IO
- Notifications for incoming calls

---

## 🗄️ Database Collections

- `users` — User profiles  
- `skills` — Available skills  
- `swapRequests` — Swap requests  
- `messages` — Peer messages  
- `notifications` — Notifications for messages, calls, and requests

---
