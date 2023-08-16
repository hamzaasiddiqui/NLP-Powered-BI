import React, { useState } from "react";
import { subHours } from "date-fns";
import Face2Icon from "@mui/icons-material/Face2";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import ChartComponent from './chart2'
axios.defaults.baseURL = "http://localhost:5000";

const Chatbot = ({ setIsConnected }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello!",
      timestamp: subHours(new Date(), 1),
      sender: "user",
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

      const res = response.data['DATA'];
      const chartConfigString = response.data['CHART'];
      const SQL_QUERY = response.data['SQL_QUERY'];
      const TYPE = response.data['TYPE'];
      
      const expandedChartConfigString = chartConfigString.replace(/res\.map\(\(\[labels, _\]\) => labels\)/g, JSON.stringify(res.map(([labels, _]) => labels)))
                                                         .replace(/res\.map\(\(\[_, data\]\) => data\)/g, JSON.stringify(res.map(([_, data]) => data)));
    
      
      
    
      console.log(expandedChartConfigString)
      
      const botMessage = {
        id: messages.length + 1,
        text: expandedChartConfigString,
        timestamp: new Date(),
        sender: "bot",
        type: TYPE,
        SQL_QUERY: SQL_QUERY,
      };

      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsSending(false);
  };

  const handleDisconnection = async () => {
    console.log("Before disconnection call");
    try {
      const response = await axios.post("/api/disconnectDB");
      console.log("DB disconnected!");
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting from database", error);
    }
    console.log("After disconnection call");
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={5}>
          <Box
            sx={{
              borderRadius: 4,
              maxHeight: 400,
              overflowY: "scroll",
              p: 4,
              boxShadow: 10,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: message.sender === "user" ? "row-reverse" : "row",
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
                  {message.sender === "bot" ? (
                    <div>
                      <ChartComponent chartData={message.text}/>
                    </div>
                  ) : (
                    <Typography>{message.text}</Typography>
                  )}
                  
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
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Connection Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ marginBottom: "10px" }}>
                <b>Important: disconnecting from the database will prompt you to connect again!</b>
              </Typography>
              <Button variant="outlined" color="error" onClick={handleDisconnection}>
                Disconnect Database
              </Button>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Container>
    </Box>
  );
};

export default Chatbot;
