import { useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import Face2Icon from "@mui/icons-material/Face2";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { padding } from "@mui/system";

const Page = () => {
  const [messages, setMessages] = useState([
    {
        id: 1,
        text: "Hello!",
        timestamp: subHours(new Date(), 1),
        sender: "user",
    },
    {
      id: 2,
      text: "Hi there! I am your Database Assistant. You can ask me anything about your database",
      timestamp: subHours(new Date(), 1),
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  return (
    <>
      <Head>
        <title>Chatbot</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8}}>
        <Container maxWidth="xl">
          <Stack spacing={5}>
            <Typography variant="h4" align="center" >
              Chatbot 🤖
            </Typography>
            <Box
              sx={{
                borderRadius: 4,
                maxHeight: 400,
                overflowY: "scroll",
                p: 4,
                boxShadow: 10
              }}
            >
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
                    <Face2Icon sx={{ mr: 3 , marginLeft:5}} />
                  )}
                  <Box>
                    <Typography>{message.text}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {message.timestamp.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
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
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
