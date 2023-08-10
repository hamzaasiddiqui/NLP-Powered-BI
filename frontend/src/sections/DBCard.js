import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { CircularProgress, Alert } from "@mui/material";

axios.defaults.baseURL = "http://localhost:5000";

export default function BasicCard() {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Connect");
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    host: "",
    database: "",
    user: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setButtonText("Connecting...");
    setError(null);

    // Get form data
    const host = document.getElementById("host").value;
    const database = document.getElementById("database").value;
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    // Creating data object
    const formData = {
      host,
      database,
      user,
      password,
    };

    try {
      const response = await axios.post("/api/connectDB", formData);
      console.log("DB connection form submitted", response.data);
    } catch (error) {
      console.error("Error sending database credentials", error);
      setError("Could not establish connection! Check database credentials and try again.");
      setFormData((prevData) => ({ ...prevData, password: "" }));
    } finally {
      setLoading(false);
      setButtonText("Connect");
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Connect to Database
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Enter your credentials to connect to database server.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="host"
            label="Enter Host Name"
            type="string"
            fullWidth="true"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="port"
            label="Enter Port Number"
            type="string"
            fullWidth="true"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="database"
            label="Enter Database Name"
            type="string"
            fullWidth="true"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="user"
            label="Enter Username"
            type="string"
            fullWidth="true"
            sx={{ marginBottom: 2 }}
          />
          <TextField id="password" label="Enter Password" type="password" fullWidth="true" />
          <CardActions>
            <Button type="submit" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : buttonText}
            </Button>
            {error && <Alert severity="error" style={{color: '#f44336'}}>{error}</Alert>}
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
}
