
# 💬 Message App

A full-stack real-time messaging platform built using **FastAPI**, **WebSockets**, **MongoDB**, **Redis**, and a **React (Vite)** frontend. It enables real-time one-to-one chat with authentication, WebSocket messaging, persistent chat history, and secure HTTPS deployment via NGINX and Certbot.

---

## 📁 Project Structure

```
message-app/
│
├── backend/
│   ├── main.py              # FastAPI app initialization
│   ├── messaging.py         # WebSocket message handling
│   ├── chatroom.py          # Chat room creation & retrieval
│   ├── websocket.py         # WebSocket routes
│   ├── context.py           # Shared application state/context
│   ├── redispool.py         # Redis connection handler
│   ├── server.py            # Optional server wrapper
│   ├── requirements.txt     # Backend dependencies
│
├── message-app-ui/         # React frontend using Vite
│   └── ...                 # Components, routes, pages, assets, styling
```

---

## 🚀 Features

- ✅ User Authentication (Signup / Login)
- 🔐 Session handling with `sessionStorage` & `Redux`
- 💬 Real-time messaging using WebSockets
- 📁 MongoDB for persistent chat storage
- ⚡ Redis for fast context and temporary storage
- 🌍 Secure HTTPS with NGINX + Let's Encrypt
- 🧩 Scalable and modular architecture
- 🖥️ UI powered by React + Vite

---

## ⚙️ Backend Setup

### 1. Setup & Activate Virtual Env

```bash
cd backend
python3 -m venv env
source env/bin/activate
```

### 2. Install Required Packages

```bash
pip install -r requirements.txt
```

### 3. Run the FastAPI App
```bash
python3 main.py
```

## 🚀 Backend Flow (FastAPI)

### ✅ 1. **Authentication**
- `/api/register`: Register a user (returns JWT token and user info).
- `/api/login`: Login with email and password.
- `/api/me`: Authenticated route to fetch current user based on token.

### ✅ 2. **Chat Management**
- `/api/chats`: Fetch or create chat rooms between users.
- `/api/messages/{room_id}`: Fetch messages for a specific chat room.

### ✅ 3. **WebSocket (Real-Time Messaging)**
- `/ws/{user_id}`: WebSocket connection per logged-in user.
- Client sends:
  ```json
  {
    "room_id": "abc123",
    "sender_id": "user1",
    "message": "Hello!"
  }
  ```
- Server:
  - Saves message to MongoDB.
  - Broadcasts to all active connections using `ConnectionManager`.

---
---

## 🌐 Frontend Setup

```bash
cd message-app-ui
npm install
npm run dev        # Development mode
npm run build      # Production build
```

Your production build will be located inside `message-app-ui/dist`.

### ✅ 1. **Authentication**
- `SignUp` / `Login` components send user data to backend.
- On success:
  - JWT and user data are stored in `sessionStorage`.
  - Redux state is updated with `authtoken`, `userData`.

### ✅ 2. **Homepage (`/`)**
- Shows sidebar (`ChatSidebar`) with all users.
- Click on user creates a chat room.
- Existing chat rooms are listed on right.
- Click on room → opens `ChatRoom` component.

### ✅ 3. **ChatRoom**
- Fetches past messages via REST API (`/api/messages/{room_id}`).
- Establishes WebSocket connection to `/ws/{user_id}`.
- Messages sent through WebSocket.
- Incoming messages are added to state and displayed in real-time.

---

---

## 📡 WebSocket Endpoint

- URL: `ws://localhost:9010/ws/{user_id}`
- Connects each client to their WebSocket channel
- Messages are saved to MongoDB and broadcasted to all active clients

---

## 🔄 Future Improvements

- ✅ Pagination or infinite scroll for messages.
- ✅ User status (online/offline).
- ✅ File/image sharing.
- ✅ Read receipts.

---

## 🧠 Author

Made with ❤️ by [Vishnuvardhan Venkannagari](https://github.com/Vishnuvardhan-Venkannagari)

---

## 🔄 Deployment Recap

| Layer        | Technology          |
|--------------|---------------------|
| Frontend     | React + Vite        |
| Backend      | FastAPI             |
| Realtime     | WebSocket           |
| Database     | MongoDB             |
| Cache/Queue  | Redis               |

---

## 🙌 Author

Developed by **Vishnuvardhan Venkannagari**  
🔗 [GitHub](https://github.com/Vishnuvardhan-Venkannagar)

---

## 📝 License

This project is open source and free to use.
