const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for testing)
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Mock user database
const users = [];

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ token: "mock-token", message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Register endpoint
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        res.status(400).json({ message: "Username already exists" });
    } else {
        users.push({ username, password });
        res.json({ message: "Registration successful" });
    }
});

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("receiveMessage", data); // Broadcast the message to all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});