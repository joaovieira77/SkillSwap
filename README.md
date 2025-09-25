# 🧠 SkillSwap — Skill Exchange Platform

SkillSwap is a full-stack web application that enables users to exchange skills directly and personally.

- This project was developed as part of the final project for the Bytes4Future training program.

---

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

# 🧠 SkillSwap — Plataforma de Troca de Competências

SkillSwap é uma aplicação web full-stack que permite aos utilizadores trocar competências de forma direta e personalizada.

- O projeto foi desenvolvido no âmbito do projeto final da formação Bytes4Future.

---

## 🌐 Visão Geral

SkillSwap é composto por dois componentes principais:

- **Frontend**: Construído com React, oferecendo uma interface responsiva e centrada no utilizador.
- **Backend**: Construído com Node.js e Express, ligado ao MongoDB usando o driver nativo. Inclui também um servidor de sinalização WebRTC para chamadas de vídeo.

---

## ⚙️ Tech Stack

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Frontend   | React, Axios, React Router          |
| Backend    | Node.js, Express, MongoDB           |
| Estilo     | Tailwind CSS / CSS Modules          |
| Tempo Real | Socket.IO (mensagens e chamadas)    |

---

## 🧩 Funcionalidades Principais

### 👥 Perfis e Competências

- Adicionar competências que dominam e aquelas que querem aprender
- Matchmaking baseado em compatibilidade de competências

### 🔁 Pedidos de Troca

- Enviar, aceitar ou rejeitar pedidos de troca

### 💬 Mensagens

- Chat em tempo real entre utilizadores
- Notificações para novas mensagens

### 📹 Chamadas de Vídeo

- Chamadas peer-to-peer via WebRTC
- Sinalização feita com Socket.IO
- Notificações para chamadas recebidas

---

## 🗄️ Coleções da Base de Dados

- `users` — Perfis dos utilizadores  
- `skills` — Competências disponíveis  
- `swapRequests` — Pedidos de troca  
- `messages` — Conversas entre pares  
- `notifications` — Alertas de mensagens, chamadas e pedidos

