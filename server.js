require("dotenv").config({ path: ".env" });
const cors = require("cors");
const express = require("express");
const db = require("./database");

const server = express();
server.use(express.json());
server.use(cors());

const Port = process.env.PORT || 8080;

server.post("/api/users", (req, res) => {
    // console.log(req.body);
    if (req.body.name === null || req.body.bio === null) {
        res.status(400).json({
            message: "Please provide name and bio for the user.",
        });
    } else {
        const newUser = db.createUser({ ...req.body });
        res.status(201).json(newUser);
    }
});
server.get("/api/users", (req, res) => {
    const allUsers = db.getUsers();
    res.status(200).json(allUsers);
});
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            message: "User Not Found",
        });
    }
});
server.delete("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id);

    if (user) {
        db.deleteUser(req.params.id);
        res.status(204).end();
    } else {
        res.status(404).json({
            message: "User not found",
        });
    }
});
server.put("/api/users/:id", async (req, res) => {
    const user = db.getUserById(req.params.id);

    if (req.body.name === undefined || req.body.bio === undefined) {
        res.status(400).json({
            message: "Please provide name and bio for the user.",
        });
    } else if (user) {
        db.updateUser(req.params.id, req.body);
        await res.status(200).json({
            id: user.id,
            name: req.body.name,
            bio: req.body.bio,
        });
    } else {
        res.status(404).json({
            message: "User not found",
        });
    }
});

server.listen(Port, () => {
    console.log(`server started on port http://localhost:8080`);
});
