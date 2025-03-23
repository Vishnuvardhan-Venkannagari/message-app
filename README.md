
# 💬 Message App

A full-stack real-time messaging platform built using **FastAPI**, **WebSockets**, **MongoDB**, **Redis**, and a **React (Vite)** frontend. It enables real-time one-to-one chat with authentication, WebSocket messaging, persistent chat history, and secure HTTPS deployment via NGINX and Certbot.


Register two users via the signup page.

Login as User A and view all other users on the sidebar.

Click on User B → Chat room is created (if it doesn't already exist).

Send message from User A to User B.

Log out and login as User B, and refresh to see chat room and the latest message.

Chat updates in real-time using WebSocket (ws://localhost:9010/ws/{user_id}).

---

## ✅ Pre-Requisites

Before running the project, ensure the following tools are installed on your system:

### 🔧 Required Installations

- 🐍 **Python 3.7+**  
  Required for running the FastAPI backend.

- 🟢 **Node.js (v16+)**  
  Required for running the React frontend via Vite.

- ⚛️ **React (via Vite)**  
  Will be set up automatically with `npm install`.

- 🍃 **MongoDB**  
  Install and configure MongoDB with the following credentials:
  - **Username:** `admin`  
  - **Password:** `admin`  
  - Database: `message_app`

- 🚀 **Redis**  
  Required for handling real-time WebSocket broadcasting and caching.

### 📌 Tip

Use tools like `brew` (macOS), `apt` (Ubuntu), or download installers from the official websites for each dependency.

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
