import React, { useState, useEffect } from "react";
import Face2Icon from "@mui/icons-material/Face2";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import DBbutton from "../sections/DBbutton";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CssBaseline,
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
import CustomizableChart from "./CustomizableChart";
import DynamicTable from "./table";
axios.defaults.baseURL = "http://localhost:5000";
var columns = null;
var SQL_QUERY = null;
let DATA = null;
function selectColumns(inputArray, columnIndex1) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) {
    throw new Error("Invalid input array");
  }

  if (
    !Number.isInteger(columnIndex1) ||
    columnIndex1 < 0 ||
    columnIndex1 >= inputArray[0].length
  ) {
    throw new Error("Invalid column index");
  }
  const copyOfData = inputArray.slice();
  for (let i = 0; i < copyOfData.length; i++) {
    if (columnIndex1 >= 0 && columnIndex1 < copyOfData[i].length) {
      [copyOfData[i][columnIndex1], copyOfData[i][0]] = [copyOfData[i][0], copyOfData[i][columnIndex1]];
      
    }
    [columns[0], columns[columnIndex1]] = [columns[columnIndex1], columns[0]];
  }
  
  return copyOfData;
}

const Chatbot = ({ setIsConnected }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [model, setModel] = useState("GPT 3.5");
  const [visualization, setVisualization] = useState("Chart.js");
  const [chart, setChart] = useState("Bar");
  const [XAxis, setXAxis] = useState(0);
  const [YAxis, setYAxis] = useState(1);

  const handleXAxisChange = (event) => {
    setXAxis(event.target.value);
  };
  const handleYAxisChange = (event) => {
    setYAxis(event.target.value);
  };
  const handleChartChange = (event) => {
    setChart(event.target.value);
  };
  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleVisualizationChange = (event) => {
    setVisualization(event.target.value);
  };

  useEffect(() => {}, [messages]);

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

      DATA = response.data["DATA"];
      SQL_QUERY = response.data["SQL_QUERY"];
      columns = response.data["columns"];
      

      const newBotMessage = {
        id: messages.length + 1,
        timestamp: new Date(),
        sender: "bot",
        chart: null,
        data: DATA,
        SQL_QUERY: SQL_QUERY,
        columns: columns,
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

  const handleGenerateGraph = (event) => {
    console.log(XAxis);
    console.log(YAxis);
    const data = selectColumns([...DATA], XAxis);
    console.log(data);
    const newBotMessage = {
      id: messages.length + 1,
      timestamp: new Date(),
      sender: "bot",
      chart: chart,
      data: data,
      Xlabel: columns[XAxis],
      Ylabel: columns.filter((element, i) => i !== XAxis),
      ChartTitle: "Chart", 
    };

    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    
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
                    {message.sender === "bot" && message.chart == null ? (
                      <Typography variant="h6" fontWeight="bold">
                        SQL QUERY GENERATED:{" "}
                      </Typography>
                    ) : (
                      <Typography>{message.text}</Typography>
                    )}
                    {message.sender === "bot" && message.chart == null ? (
                      <Typography>{message.SQL_QUERY}</Typography>
                    ) : (
                      <></>
                    )}
                    {message.sender === "bot" && message.chart != null ? (
                      <CustomizableChart chartType={message.chart} data={message.data} Xlabel={message.Xlabel} Ylabel={message.Ylabel} ChartTitle={message.ChartTitle}/>
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

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Chart
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={chart}
                label="Age"
                onChange={handleChartChange}
              >
                <MenuItem value="Bar">Bar Chart</MenuItem>
                <MenuItem value="Pie">Pie Chart</MenuItem>
                <MenuItem value="Line">Line Chart</MenuItem>
                <MenuItem value="Doughnut">Doughnut Chart</MenuItem>
                <MenuItem value="Scatter">Scatter Plot</MenuItem>
                {/* <MenuItem value="Bubble">Bubble Chart</MenuItem> */}
                <MenuItem value="Radar">Radar Chart</MenuItem>
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
                <MenuItem value="Lamma 2" disabled>
                  Lamma 2
                </MenuItem>
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
                <MenuItem value="D3" disabled>
                  D3
                </MenuItem>
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

          {columns && columns.length > 0 && (
            <Stack direction="row" spacing={4} alignItems="center">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{chart === "Pie" || chart === "Radar" || chart === "Doughnut" ? "Select Label" : "Select X-Axis"}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={XAxis}
                  label="Age"
                  onChange={handleXAxisChange}
                >
                  {columns.map((column, index) => (
                    <MenuItem key={index} value={index}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{chart === "Pie" || chart === "Radar" || chart === "Doughnut" ? "Select Dataset" : "Select Y-Axis"}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={YAxis}
                  label="Age"
                  onChange={handleYAxisChange}
                >
                  {columns.map((column, index) => (
                    <MenuItem key={index} value={index}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleGenerateGraph}>Generate Graph</Button>
            </Stack>
          )}
          <div>
            <h4>SQL Query Results</h4>

            {DATA && (<DynamicTable data={DATA} tableHead={columns} maxHeight={300} />)}
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
              <Box display="flex" justifyContent="center">
                <DBbutton />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Container>
    </Box>
  );
};

export default Chatbot;
