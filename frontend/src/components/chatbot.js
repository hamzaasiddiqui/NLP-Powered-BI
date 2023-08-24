import React, { useState, useEffect } from "react";
import Face2Icon from "@mui/icons-material/Face2";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import ResizableChart from "./chart2";
import { margin } from "@mui/system";
import DynamicTable from "./table";
axios.defaults.baseURL = "http://localhost:5000";
var res = null;
const Chatbot = ({ setIsConnected }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [model, setModel] = useState("GPT 3.5");
  const [visualization, setVisualization] = useState("Chart.js");

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleVisualizationChange = (event) => {
    setVisualization(event.target.value);
  };

  useEffect(() => {
    console.log(messages); // Log the updated messages state
  }, [messages]);

  const handleSendMessage = async () => {
    if (isSending || newMessage.trim() === "") {
      return;
    }

    setIsSending(true);

    const newUserMessage = {
      id: messages.length,
      text: newMessage,
      timestamp: new Date(),
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setNewMessage("");

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        query: newMessage,
      });

      res = response.data["DATA"];
      const chartConfigString = response.data["CHART"];
      const SQL_QUERY = response.data["SQL_QUERY"];
      const TYPE = response.data["TYPE"];

      const expandedChartConfigString = chartConfigString
        .replace(
          /res\.map\(\(\[labels, _\]\) => labels\)/g,
          JSON.stringify(res.map(([labels, _]) => labels))
        )
        .replace(
          /res\.map\(\(\[_, data\]\) => data\)/g,
          JSON.stringify(res.map(([_, data]) => data))
        );

      const newBotMessage = {
        id: messages.length + 1,
        text: expandedChartConfigString,
        timestamp: new Date(),
        sender: "bot",
        type: TYPE,
        SQL_QUERY: SQL_QUERY,
      };

      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
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
            {messages.length > 0 &&
              messages.map((message) => (
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
                    {message.sender === "bot" && message.type === "chart" ? (
                      <ResizableChart chartData={message.text} />
                    ) : (
                      <Typography>{message.text}</Typography>
                    )}
                    {message.sender === "bot" ? (
                      <Typography variant="h6" fontWeight="bold">
                        SQL QUERY GENERATED:{" "}
                      </Typography>
                    ) : (
                      <></>
                    )}
                    {message.sender === "bot" ? (
                      <Typography>{message.SQL_QUERY}</Typography>
                    ) : (
                      <></>
                    )}

                    <Typography variant="caption" color="textSecondary">
                      {message.timestamp.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Select Database */}
            <FormControl fullWidth size="small" disabled>
              <InputLabel id="demo-simple-select-label">Select Database</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={}
                label="Age"
                // onChange={}
              >
                <MenuItem value={10}>Northwind</MenuItem>
              </Select>
            </FormControl>
            {/* Select Model */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Model
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={model}
                label="Age"
                onChange={handleModelChange}
              >
                <MenuItem value="GPT 3.5">GPT 3.5</MenuItem>
                <MenuItem value="Lamma 2" disabled>Lamma 2</MenuItem>
              </Select>
            </FormControl>
            {/* Select Visualization */}
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Select Visualization</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={visualization}
                label="Age"
                onChange={handleVisualizationChange}
              >
                <MenuItem value="Chart.js">Chart.js</MenuItem>
                <MenuItem value="D3" disabled>D3</MenuItem>
              </Select>
            </FormControl>
          </Stack>
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
          <div>
            <h4>SQL Query Results</h4>
            {res && <DynamicTable data={res} maxHeight={300} />}
          </div>
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
