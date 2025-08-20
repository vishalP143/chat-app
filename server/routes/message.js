const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// Send message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const newMessage = new Message({
      conversationId,
      sender: req.user.id,
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages of a conversation
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort("createdAt");
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
