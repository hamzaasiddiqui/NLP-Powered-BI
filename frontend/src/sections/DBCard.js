import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import { CircularProgress, Alert } from "@mui/material";

axios.defaults.baseURL = "http://localhost:5000";

export default function BasicCard({ setIsConnected }) {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Connect");
  const [error, setError] = useState(null);
  const [connectionType, setConnectionType] = useState("details"); // Default to entering details

  const [formData, setFormData] = useState({
    host: "",
    port: "",
    database: "",
    user: "",
    password: "",
    databaseUrl: "postgres://puttplgt:BliGMxjlgIxuqLudrJb56yVWm8p1Uq5U@lucky.db.elephantsql.com/puttplgt",
    openai_api_key: "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",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setButtonText("Connecting...");
    setError(null);

    try {
      const response = await axios.post("/api/connectDB", {
        ...formData,
        connectionType, // Send connection type to the backend
      });
      console.log("DB connection form submitted", response.data);
      setIsConnected(true);
    } catch (error) {
      console.error("Error sending database credentials", error);
      setError(
        "Could not establish connection! Check database credentials and try again."
      );
      setFormData((prevData) => ({ ...prevData, password: "" }));
      setIsConnected(false);
    } finally {
      setLoading(false);
      setButtonText("Connect");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleConnectionTypeChange = (e) => {
    setConnectionType(e.target.value);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Connect to Database
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Choose connection type and provide the required information.
        </Typography>
        <RadioGroup
          aria-label="connection-type"
          name="connection-type"
          value={connectionType}
          onChange={handleConnectionTypeChange}
        >
          <FormControlLabel
            value="url"
            control={<Radio />}
            label="Use Database URL"
          />
          <FormControlLabel
            value="details"
            control={<Radio />}
            label="Enter Details"
          />
        </RadioGroup>
        {connectionType === "url" ? (
          <>
          <TextField
            id="databaseUrl"
            label="Enter Database URL"
            type="url"
            fullWidth
            sx={{ marginBottom: 2 }}
            onChange={handleInputChange}
            value={formData.databaseUrl}
          />
          <TextField
            id="openai_api_key"
            label="Enter Open Api Key"
            type="string"
            fullWidth
            sx={{ marginBottom: 2 }}
            onChange={handleInputChange}
            value={formData.openai_api_key}
          />
          </>
        ) : (
          <>
            <TextField
              id="host"
              label="Enter Host Name"
              type="string"
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={handleInputChange}
              value={formData.host}
            />
            <TextField
              id="port"
              label="Enter Port Number"
              type="string"
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={handleInputChange}
              value={formData.port}
            />
            <TextField
              id="database"
              label="Enter Database Name"
              type="string"
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={handleInputChange}
              value={formData.database}
            />
            <TextField
              id="user"
              label="Enter Username"
              type="string"
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={handleInputChange}
              value={formData.user}
            />
            <TextField
              id="password"
              label="Enter Password"
              type="password"
              fullWidth
              onChange={handleInputChange}
              value={formData.password}
            />
              <TextField
              id="openai_api_key"
              label="Enter Open Api Key"
              type="string"
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={handleInputChange}
              value={formData.openai_api_key}
            />
          </>
        )}
        <CardActions>
          <Button type="submit" size="large" disabled={loading} onClick={handleSubmit}>
            {loading ? <CircularProgress size={24} /> : buttonText}
          </Button>
          {error && (
            <Alert severity="error" style={{ color: "#f44336" }}>
              {error}
            </Alert>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
}
