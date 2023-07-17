import React, { useState, useRef, useEffect } from "react";
import { subHours } from "date-fns";
import Face2Icon from "@mui/icons-material/Face2";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello!",
      timestamp: subHours(new Date(), 1),
      sender: "user",
    },
    {
      id: 2,
      text:
        "Hi there! I am your Database Assistant. You can ask me anything about your database",
      timestamp: subHours(new Date(), 1),
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (isSending || newMessage.trim() === "") {
      return;
    }

    setIsSending(true);

    const message = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date(),
      sender: "user",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        query: newMessage,
      });

      const botReply = response.data;
      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        timestamp: new Date(),
        sender: "bot",
      };

      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsSending(false);
  };

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      component="main"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {/* Chatbot header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer",
        }}
        onClick={handleToggleChatbot}
      >
        <Typography variant="h6">Chatbot 🤖</Typography>
      </Box>

      {/* Chatbot content */}
      {isOpen && (
        <Box
          sx={{
            borderRadius: 4,
            maxHeight: 700,
            maxWidth: 700,
            overflowY: "scroll",
            p: 4,
            boxShadow: 10,
            backgroundColor: "#fff",
          }}
          ref={chatContainerRef}
        >
          {/* Messages */}
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                flexDirection:
                  message.sender === "user" ? "row-reverse" : "row",
                alignItems: "center",
                mb: 4,
              }}
            >
              {message.sender === "bot" ? (
                <SmartToyIcon sx={{ mr: 3 }} />
              ) : (
                <Face2Icon sx={{ mr: 3, marginLeft: 5 }} />
              )}
              <Box>
                <Typography>{message.text}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {message.timestamp.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Input field and send button */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              sx={{ backgroundColor: "#fff" }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={isSending}
            >
              Send
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;
