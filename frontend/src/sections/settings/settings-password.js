import React, { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { auth } from "../../firebase";
import { updatePassword } from "firebase/auth";
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


export const SettingsPassword = () => {
  const [values, setValues] = useState({
    current: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = () => {
    if (values.password !== values.confirm) {
      setError('Passwords don\'t match');
      setSuccessMessage(null);
      return;
    }
  
    const user = auth.currentUser;
  
    if (!user) {
      setError('User not authenticated');
      setSuccessMessage(null);
      return;
    }
  
    const newPassword = values.password;
  
    const credential = EmailAuthProvider.credential(user.email, values.current);
  
    reauthenticateWithCredential(user, credential)
      .then(() => {
        return updatePassword(user, newPassword);
      })
      .then(() => {
        
        setError(null);
        setSuccessMessage('Password updated successfully');
      })
      .catch((error) => {
        setError("Incorrect Current Password");
        setSuccessMessage(null);
      });
  };
  return (
    <>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Current Password"
              name="current"
              onChange={handleChange}
              type="password"
              value={values.current}
            />
            <TextField
              fullWidth
              label=" New Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="New Password (Confirm)"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
            {error && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {error}
              </div>
            )}
            {successMessage && (
              <Typography style={{ color: 'green', marginTop: '10px' }}>
                {successMessage}
              </Typography>
            )}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
