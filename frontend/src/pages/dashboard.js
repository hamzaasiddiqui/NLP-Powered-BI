import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const Page = () => {
    

  return (
    <>
      <Head>
        <title>Chatbot | Keystone</title>
      </Head>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Typography variant="h4" gutterBottom align="left" marginBottom={10}>
          Dashboard
        </Typography>
      </Container>

      {/* Code for DB Selection */}
      <div style={{ position: "absolute", overflowY: "auto", bottom: 0, marginBottom: 10 }}>
        <Divider variant="middle" style={{marginBottom: 10}}/>
        <Container maxWidth="auto" style={{ paddinG: 0, margin: 0, display: "flex" }}>
            <Card style={{ width: '150px', marginRight: 10 }} align="middle">
                <CardContent style={{height: 20}}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary">
                        Northwind
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" sx={{ width: 150 }} align="middle">Open</Button>
                </CardActions>
            </Card>
            <Card style={{ width: '150px' }}>
                <CardContent style={{height: 20}} align="middle">
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary">
                        Add New
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button sx={{ fontSize: 32, fontWeight: 500, height: 40, width: 200 }} align="middle">+</Button>
                </CardActions>
            </Card>
        </Container>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;