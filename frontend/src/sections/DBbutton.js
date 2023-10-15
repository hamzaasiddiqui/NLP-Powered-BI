import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  styled,
} from '@mui/material';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:5000";

const DatabaseConnector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    databaseUrl: '',
    // Add other necessary form data fields here
  });
  const [error, setError] = useState('');

  const handleConnect = async () => {
    const connectionType='url';
    try {
      console.log(formData.databaseUrl)
      const response = await axios.post("/api/connectDB", {databaseUrl : formData.databaseUrl,
      connectionType: connectionType});
      
      setIsOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error sending database credentials", error);
      setError(
        "Could not establish connection! Check database credentials and try again."
      );
    }
  };

  const handleDialogToggle = () => {
    setIsOpen(!isOpen);
    setError(''); // Clear any previous error messages
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <Button  onClick={handleDialogToggle}>
        Add New Database
      </Button>
      <Dialog open={isOpen} onClose={handleDialogToggle}>
        <DialogTitle>Database Connection Form</DialogTitle>
        <DialogContent>
          <FormControl>
            
            <TextField
              variant="outlined"
              name="databaseUrl"
              value={formData.databaseUrl}
              onChange={handleInputChange}
            />
            {/* Add other form fields here */}
            {error && <Typography color="error">{error}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogToggle}>Cancel</Button>
          <Button onClick={handleConnect} color="primary">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DatabaseConnector;
