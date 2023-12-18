import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  DialogTitle,
  Divider,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import {
  setDoc,
  doc
} from "firebase/firestore";
import { auth , db} from "./../../firebase";


export const AccountProfile = () => {
  const avatarUrls = [
    '/assets/avatars/avatar-alcides-antonio.png',
    '/assets/avatars/avatar-marcus-finn.png',
    '/assets/avatars/avatar-anika-visser.png',
    '/assets/avatars/avatar-miron-vitold.png',
    '/assets/avatars/avatar-cao-yu.png',
    '/assets/avatars/avatar-nasimiyu-danai.png',
    '/assets/avatars/avatar-carson-darrin.png',
    '/assets/avatars/avatar-neha-punita.png',
    '/assets/avatars/avatar-chinasa-neo.png',
    '/assets/avatars/avatar-omar-darboe.png',
    '/assets/avatars/avatar-fran-perez.png',
    '/assets/avatars/avatar-penjani-inyene.png',
    '/assets/avatars/avatar-iulia-albu.png',
    '/assets/avatars/avatar-seo-hyeon-ji.png',
    '/assets/avatars/avatar-jane-rotanson.png',
    '/assets/avatars/avatar-siegbert-gottfried.png',
    '/assets/avatars/avatar-jie-yan-song.png',
  ];
  
  
  const auth = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(null);


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAvatarClick = (avatarUrl) => {
    setSelectedAvatarUrl(avatarUrl);
  };

  const handleSaveAvatar = async () => {
    if (selectedAvatarUrl && auth.user) {
      const id = auth.user.id.trim();
      auth.user.avatar = selectedAvatarUrl;
      await setDoc(doc(db, "users", id), {
        avatar: selectedAvatarUrl,
      }, { merge: true });
      handleCloseDialog();
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={(auth.user)?auth.user.avatar:'#'}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {(auth.user)?auth.user.name:'#'}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
          onClick={handleOpenDialog} // Open the dialog when the button is clicked
        >
          Change Avatar
        </Button>
      </CardActions>

      {/* Avatar Change Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom={3}>
            Choose an avatar from the options below:
          </DialogContentText>
         
          <Grid container spacing={0}>
            {avatarUrls.map((avatarUrl, index) => (
              <Grid item key={index} xs={2}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    height: 50,
                    width: 50,
                    marginBottom: 1,
                    marginTop: 1,
                    cursor: 'pointer',
                    border: selectedAvatarUrl === avatarUrl ? '3px solid #007bff' : 'none', 
                  }}
                  onClick={() => handleAvatarClick(avatarUrl)}
                />
              </Grid>
            ))}
          </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button onClick={handleSaveAvatar} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
