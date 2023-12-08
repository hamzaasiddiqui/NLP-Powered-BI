import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select  from "@mui/material/Select";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem"
import { CircularProgress, Alert } from "@mui/material";
import { auth, db } from "../firebase";
import { useAuth } from 'src/hooks/use-auth';
import {
  setDoc,
  doc,
  getDoc
} from "firebase/firestore";

axios.defaults.baseURL = "http://localhost:5000";

export default function BasicCard({ setIsConnected, setDatabaseUrl }) {
  const auth = useAuth();
  const [selectedSavedDatabase, setSelectedSavedDatabase] = useState(""); // Track the selected saved database
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Connect");
  const [error, setError] = useState(null);
  const [connectionType, setConnectionType] = useState("url"); // Default to entering details
  const [savedDatabases, setSavedDatabases] = useState([]); 
  const [allDatabases, setAllDatabases] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "",
    database: "",
    user: "",
    password: "",
    databaseUrl: "postgres://puttplgt:BliGMxjlgIxuqLudrJb56yVWm8p1Uq5U@lucky.db.elephantsql.com/puttplgt",
    openai_api_key: "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",
    schema: "public"
  });

  useEffect(() => {
    const fetchSavedDatabases = async () => {
      try {
        // Fetch saved databases from Firestore
        const userDocRef = doc(db, "users", auth.user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const savedDatabases = userData.databases || {};
          setAllDatabases(savedDatabases);
          // Update the state to trigger a re-render and populate the dropdown
          setSavedDatabases(Object.keys(savedDatabases));
        } else {
          console.log("User document does not exist in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching saved databases", error);
      }
    };

    fetchSavedDatabases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setButtonText("Connecting...");
    setError(null);
    console.log(connectionType)
    if(connectionType === "details"){
      console.log(allDatabases)
      formData.databaseUrl = allDatabases[selectedSavedDatabase]['databaseUrl'];
      formData.schema = allDatabases[selectedSavedDatabase]['schema'];
    }
    try {
      const response = await axios.post("/api/connectDB", {
        ...formData,
        connectionType,
      });

      console.log("DB connection form submitted", response.data);

      // If the user chose "Add New Database," save the database information to Firestore
      if (connectionType === "url") {
        const userDocRef = doc(db, "users", auth.user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedDatabases = {
            ...(userData.databases || {}),
            [formData.name]: {
              databaseUrl: formData.databaseUrl,
              schema: formData.schema,
              name: formData.name,
            },
          };

          await setDoc(userDocRef, {
            databases: updatedDatabases,
          }, { merge: true });
        } else {
          await setDoc(userDocRef, {
            databases: {
              [formData.name]: {
                databaseUrl: formData.databaseUrl,
                schema: formData.schema,
                name: formData.name,
              },
            },
          }, { merge: true });
        } 
      }
    console.log("Database information added to Firestore");
  } 
  catch (error) {
  console.error("Error adding database information to Firestore", error);
  }
      
  setDatabaseUrl(formData.databaseUrl);
  setIsConnected(true);
  setFormData((prevData) => ({ ...prevData, password: "" }));
  setLoading(false);
  setButtonText("Connect");
    
};


  const handleSavedDatabaseChange = (event) => {
    setSelectedSavedDatabase(event.target.value);
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
            label="Add New Database"
          />
          <FormControlLabel
            value="details"
            control={<Radio />}
            label="Connect to saved Database"
          />
        </RadioGroup>
        {connectionType === "details" && (
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="saved-database-label">Select Saved Database</InputLabel>
          <Select
            labelId="saved-database-label"
            id="saved-database"
            value={selectedSavedDatabase}
            onChange={handleSavedDatabaseChange}
          >
            {savedDatabases.map((dbName) => (
              <MenuItem key={dbName} value={dbName}>
                {dbName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

        {connectionType === "url" ? (
          <>
          <TextField
            id="name"
            label="Enter Database Name"
            type="name"
            fullWidth
            sx={{ marginBottom: 2 }}
            onChange={handleInputChange}
            value={formData.name}
          />

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
          <TextField
            id="schema"
            label="Enter schema name for database"
            type="string"
            fullWidth
            sx={{ marginBottom: 2 }}
            onChange={handleInputChange}
            value={formData.schema}
          />
          </>
        ) : (
          <>
            
          </>
        )}
        <CardActions>
        <Button
          size="large"
          disabled={loading}
          onClick={
            handleSubmit
          }
        >
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
