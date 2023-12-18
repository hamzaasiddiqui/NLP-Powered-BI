import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { auth, db } from "../../firebase";
import { useAuth } from 'src/hooks/use-auth';
import {
  setDoc,
  doc
} from "firebase/firestore";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const AccountProfileDetails = () => {
  const auth = useAuth();

  const [values, setValues] = useState({
    name: (auth.user) ? auth.user.name : '',
    email: (auth.user) ? auth.user.email : '',
  });

  const [opacity, setOpacity] = useState(0);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = async () => {
    if (!(auth.user.name === values.name && auth.user.email === values.email) && auth.user) {
      const id = auth.user.id.trim();
      auth.user.name = values.name;
      auth.user.email = values.email;
      await setDoc(doc(db, "users", id), {
        name: values.name,
        email: values.email
      }, { merge: true });

      setOpacity(1);
    }
  }


  return (
    <>
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          
            <Box
              sx={{
                marginRight: 2, marginTop: 1, opacity: opacity
              }}
            >
              <CheckCircleOutlineIcon color="success" />
            </Box>
        
          <Button variant="contained" onClick={handleSubmit}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
