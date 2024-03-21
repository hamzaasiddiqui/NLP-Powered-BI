import Head from "next/head";
import { useState, useEffect } from 'react';
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Divider, Typography, Modal, Box, TextField, Button, InputLabel, Select, MenuItem } from "@mui/material";
import { Container } from "@mui/system";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { auth, db } from "../firebase";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  deleteDoc, 
  doc
} from "firebase/firestore";
import { useAuth } from 'src/hooks/use-auth';
import axios from "axios";
import { ChevronRight } from "@mui/icons-material";

import CustomizableChart from "../components/CustomizableChart";

const Page = () => {
  const [dashboards, setDashboards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState('');
  const [newDatabaseLink, setNewDatabaseLink] = useState('');
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [openDashboard, setOpenDashboard] = useState(null); // Track the currently open dashboard
  const auth = useAuth();
  const [savedDatabases, setSavedDatabases] = useState([]); 
  const [allDatabases, setAllDatabases] = useState(null);
  const [selectedSavedDatabase, setSelectedSavedDatabase] = useState("");
  const [chartData, setChartData] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      if (auth.user) {
        try {
          const dashboardsCollection = collection(db, 'users', auth.user.id, 'dashboard');
          const dashboardsSnapshot = await getDocs(dashboardsCollection);

          const dashboardsData = dashboardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
         
          setDashboards(dashboardsData);
        } catch (error) {
          console.error('Error fetching dashboards:', error);
        }
      }
    };
    
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
    
    fetchData();
  }, [auth.user]);

  const fetchChartData = async (schema, sql, url) => {
    try {
      const response = await axios.post("http://localhost:5000/api/SQL", {
        schema,
        sql,
        url
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



    const fetchDashboardData = async (dashboard) => {
      setOpenDashboard(dashboard);
    
      if (dashboard) {
        const updatedChartData = {};
  
        // Loop through openDashboard.visualizations
        for (const [chartTitle, chartConfig] of Object.entries(dashboard.visualizations)) {
          try {
            const data = await fetchChartData(dashboard.schema, chartConfig.sql, dashboard.databaseLink);
            
            updatedChartData[chartTitle] = data;
          } catch (error) {
            console.error(`Error fetching data for ${chartTitle}:`, error);
          }
        }
   

        setChartData(updatedChartData);


      }
    };


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSavedDatabaseChange = (event) => {
    setSelectedSavedDatabase(event.target.value);
  };
  const handleDeleteDashboard = async () => {
    try {
      const dashboardsCollection = collection(db, 'users', auth.user.id, 'dashboard');
      await deleteDoc(doc(dashboardsCollection, openDashboard.id));

      setDashboards((prevDashboards) => prevDashboards.filter(d => d.id !== openDashboard.id));
      handleCloseDashboard();
    } catch (error) {
      console.error('Error deleting dashboard:', error);
    }
  };
  const handleAddDashboard = async () => {
    
    try {
      const dashboardsCollection = collection(db, 'users', auth.user.id, 'dashboard');
      const newDashboardRef = await addDoc(dashboardsCollection, {
        title: newDashboardTitle,
        databaseLink: allDatabases[selectedSavedDatabase]['databaseUrl'],
        databaseName: selectedSavedDatabase,
        schema: allDatabases[selectedSavedDatabase]['schema'],
        visualizations: {}, // Initialize with an empty array
      });

      setDashboards((prevDashboards) => [
        ...prevDashboards,
        {
          id: newDashboardRef.id,
          title: newDashboardTitle,
          databaseLink: allDatabases[selectedSavedDatabase]['databaseUrl'],
          databaseName: selectedSavedDatabase,
          schema: allDatabases[selectedSavedDatabase]['schema'],
          visualizations: {},
        },
      ]);

      setNewDashboardTitle('');
      setNewDatabaseLink('');
      setNewDatabaseName('');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding dashboard:', error);
    }
  };

  const handleOpenDashboard = async (dashboard) => {
    await fetchDashboardData(dashboard);
  };

  const handleCloseDashboard = () => {
    setOpenDashboard(null);
  };



  return (
    <>
      <Head>
        <title>Dashboard | Keystone</title>
      </Head>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Typography variant="h4" marginTop={-2} >
          Dashboard {(openDashboard)? '| ' + openDashboard.title : ''}
        </Typography>
        <Typography variant="h5" marginTop={15}>
          Getting Started:
        </Typography>
        <Typography variant="h6">
          <br></br><br></br>
          <ChevronRight />
          Create a new dashboard by selecting 'Add New' from below
          <br></br><br></br>
          <ChevronRight />
          Select any dashboard from below
          <br></br><br></br>
          <ChevronRight />
          Or Create a new dashboard by selecting 'Add New' from below
        </Typography>
      </Container>

      {/* Code for DB Selection */}
      <div style={{ position: 'absolute', overflowY: 'auto', bottom: 0, marginBottom: 10 }}>
        <Divider variant="middle" style={{ marginBottom: 10 }} />
        <Container maxWidth="auto" style={{ padding: 0, margin: 0, display: 'flex' }}>
          {dashboards.map((dashboard) => (
            <Card key={dashboard.id} style={{ width: '150px', marginRight: 10 }} align="middle">
              <CardContent style={{ height: 20 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary">
                  {dashboard.title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  sx={{ width: 150 }}
                  align="middle"
                  onClick={() => handleOpenDashboard(dashboard)}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          ))}
          <Card style={{ width: '150px' }}>
            <CardContent style={{ height: 20 }} align="middle">
              <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary">
                Add New
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                sx={{ fontSize: 32, fontWeight: 500, height: 40, width: 200 }}
                align="middle"
                onClick={handleOpenModal}
              >
                <AddIcon />
              </Button>
            </CardActions>
          </Card>
        </Container>
      </div>

      {/* Modal for adding a new dashboard */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Dashboard
          </Typography>
          <TextField
            label="Dashboard Title"
            fullWidth
            value={newDashboardTitle}
            onChange={(e) => setNewDashboardTitle(e.target.value)}
          />
          
          <InputLabel id="saved-database-label" >Select Saved Database</InputLabel>
          <Select
            fullWidth
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
         
          <Button variant="contained" onClick={handleAddDashboard} sx={{ mt: 2 }}>
            Add Dashboard
          </Button>
        </Box>
      </Modal>
      {/* Dashboard content */}
      {openDashboard && (
        <Box
          sx={{
            position: 'absolute',
            // width: '80%', // Use a percentage for responsive width
            // maxWidth: '90vw', // Set a maximum width to prevent it from becoming too wide
            // maxHeight: '100vh', // Set a maximum height to make it responsive and scrollable
            overflowY: 'auto', // Enable vertical scrolling when content overflows
            bgcolor: 'background.paper',
            width: 'calc(100vh $(navWidth))',
            boxShadow: 24,
            marginLeft: 0,
            p: 6,
            top: '50px',
          }}
        >
          
          {(openDashboard.visualizations && chartData) ? (
            <>
              {/* Display each item in the visualization array */}
              <Grid container spacing={2}>
              {Object.entries(openDashboard.visualizations).map(([chartTitle, chartConfig]) => (

                <Grid item xs={6} key={chartTitle}>
                  <CustomizableChart
                    chartType={chartConfig.type}
                    data={chartData[chartTitle].data}
                    Xlabel={chartConfig.xaxis}
                    Ylabel={chartConfig.yaxis}
                    ChartTitle={chartTitle}
                  />
                </Grid>

              ))}
              </Grid>
            </>
          ) : (
            <div sx={{
              height: '100vh',
              width: '100vw',
              justifyContent: 'center'
            }}>
              <div>Fetching Database Content ...</div>
              <div>Parsing Database Content ...</div>
              <div>Loading Dashboard Content ...</div>
            </div>
            )}
            <Button variant="contained" onClick={handleCloseDashboard} sx={{ mt: 2, mr: 2 }}>
              Close Dashboard
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteDashboard} sx={{ mt: 2}}>
              Delete Dashboard
            </Button>
        </Box>
      )}
    </>
  );
};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;