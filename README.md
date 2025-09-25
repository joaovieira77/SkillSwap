# 🧠 SkillSwap — Plataforma de Troca de Competências | SkillSwap — Skill Exchange Platform

SkillSwap é uma aplicação web full-stack que permite aos utilizadores trocar competências de forma direta e personalizada.  
SkillSwap is a full-stack web application that enables users to exchange skills directly and personally.



- O projeto foi desenvolvido no âmbito do projeto final da formação Bytes4Future.  
- This project was developed as part of the final project for the Bytes4Future training program.


---

## 🌐 Visão Geral | Overview

SkillSwap é composto por dois componentes principais:  
SkillSwap consists of two main components:

- **Frontend**: Construído com React, oferecendo uma interface responsiva e centrada no utilizador.  
- **Frontend**: Built with React, providing a responsive and user-focused interface.

- **Backend**: Construído com Node.js e Express, ligado ao MongoDB usando o driver nativo. Inclui também um servidor de sinalização WebRTC para chamadas de vídeo.  
- **Backend**: Built with Node.js and Express, connected to MongoDB using the native driver. Also includes a WebRTC signaling server for video calls.

---

## ⚙️ Tech Stack

| Camada / Layer | Tecnologia / Technology                |
|----------------|----------------------------------------|
| Frontend       | React, Axios, React Router             |
| Backend        | Node.js, Express, MongoDB              |
| Estilo / Style | Tailwind CSS / CSS Modules             |
| Tempo Real     | Socket.IO (mensagens e chamadas)       |
| Real-Time      | Socket.IO (messaging and video calls)  |

---

## 🧩 Funcionalidades Principais | Core Features

### 👥 Perfis e Competências | Profiles and Skills

- Adicionar competências que dominam e aquelas que querem aprender  
- Add skills users can teach and those they want to learn


- Matchmaking baseado em compatibilidade de competências  
- Matchmaking based on skill compatibility

### 🔁 Pedidos de Troca | Swap Requests

- Enviar, aceitar ou rejeitar pedidos de troca  
- Send, accept or reject swap requests


### 💬 Mensagens | Messaging

- Chat em tempo real entre utilizadores  
- Real-time chat between users

- Notificações para novas mensagens  
- Notifications for new messages

### 📹 Chamadas de Vídeo | Video Calls

- Chamadas peer-to-peer via WebRTC  
- Peer-to-peer video calls via WebRTC

- Sinalização feita com Socket.IO  
- Signaling handled via Socket.IO

- Notificações para chamadas recebidas  
- Notifications for incoming calls

---

## 🗄️ Coleções da Base de Dados | Database Collections

- `users` — Perfis dos utilizadores | User profiles  
- `skills` — Competências disponíveis | Available skills  
- `swapRequests` — Pedidos de troca | Swap requests  
- `messages` — Conversas entre pares | Peer messages  
- `notifications` — Alertas de mensagens, chamadas e pedidos | Notifications for messages, calls, and requests

---
