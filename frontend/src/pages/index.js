import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Container, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
const now = new Date();

const Page = () => {
  return (
    <>
      <Head>
        <title>Overview | Keystone</title>
      </Head>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Typography variant="h4" gutterBottom align="center" marginBottom={5}>
          Welcome to Keystone Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Favourite Charts
                </Typography>
                
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Recent Activity
                </Typography>
               
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
