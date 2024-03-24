import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Container, Typography, Grid, Card, CardContent, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import { Bolt } from "@mui/icons-material";

const now = new Date();

const Page = () => {
  // const favoriteChartsData = [
  //   { name: "Category 1", value: 30 },
  //   { name: "Category 2", value: 60 },
  //   { name: "Category 3", value: 40 },
  // ];

  const favoriteChartsData = [
    { name: "Category 1", value: 30, value2: 20, value3: 40 },
    { name: "Category 2", value: 60, value2: 40, value3: 50 },
    { name: "Category 3", value: 40, value2: 30, value3: 25 },
  ];
  
  const recentActivityChartData = [
    { day: "Day 1", value: 20 },
    { day: "Day 2", value: 40 },
    { day: "Day 3", value: 30 },
    { day: "Day 4", value: 50 },
    { day: "Day 5", value: 25 },
  ];

  const conversation = [
    { speaker: "human", message: "Can you show me the sales data for this month?" },
    { speaker: "bot", message: "Sure! Running SQL query..." },
    { speaker: "bot", message: "SELECT * FROM sales WHERE month = 'November';" },
    { speaker: "bot", message: "Here is the sales data and the chart." },
  ];

  const recentActivityTableData = [
    { activity: "Product A Sale", date: "2023-11-10", amount: 150 },
    { activity: "Product B Sale", date: "2023-11-11", amount: 200 },
    { activity: "Product C Sale", date: "2023-11-12", amount: 120 },
    { activity: "Product D Sale", date: "2023-11-13", amount: 100 },
    { activity: "Product E Sale", date: "2023-11-14", amount: 170 },

  ];

  return (
    <>
      <Head>
        <title>Overview | Keystone</title>
      </Head>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Typography variant="h4" gutterBottom align="center" marginBottom={10}>
          Welcome to NLP-Powered Business Intelligence
        </Typography>
        <Card>
          <Typography variant="h6" align="center" marginBottom={5} marginTop={5} >
            Curate customized BI dashboards and reports through Artificial Intelligence
          </Typography>

          <Grid container>
            <Grid item xs={4} marginBottom={2} paddingLeft={2} >
              <Card variant="outlined">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Dashboard Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                • Create new dashboards or open existing ones.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                • View real-time data analytics or reports (AI-generated visualization) to get complete overview of company anaytics at a glance.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                • Delete dashboards or make new ones
                </Typography>
              </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} marginBottom={2} paddingLeft={2} >
              <Card variant="outlined">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Chatbot Interface
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Connect the chatbot to a database by providing new credentials or use saved credentials.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Give chatbot prompts to retrieve data and generate visualization.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Give axis labels and chart title and save the visualization to the dashboard of your choice.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} marginBottom={2} paddingLeft={2} paddingRight={2} >
              <Card variant="outlined">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    User Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Control you avatar.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Change your username.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  • Change your password.
                  </Typography>
                </CardContent>
              </Card>  
            </Grid>
          </Grid>
        </Card>

        <Typography variant="h6" align="center" marginTop={6}>
          Example Dashboard Below
        </Typography>
        
        <Grid container spacing={3} marginTop={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom marginBottom={5}>
                  Favourite Charts
                </Typography>
                <ResponsiveContainer width="100%" height={300}>

              <BarChart data={favoriteChartsData}>
                <XAxis dataKey="name" />
                <YAxis dataKey="value" type="number" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
                <Bar dataKey="value2" fill="#82ca9d" /> 
                <Bar dataKey="value3" fill="#ffc658" /> 
              </BarChart>
            </ResponsiveContainer>
                 <ResponsiveContainer width="100%" height={300}>

              <LineChart data={favoriteChartsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            

            <ResponsiveContainer width="100%" height={300}>

              <RadialBarChart innerRadius={20} outerRadius={140} data={favoriteChartsData}>
                <RadialBar startAngle={90} endAngle={-270} minAngle={15} label background clockWise dataKey="value">
                  {favoriteChartsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                  ))}
                </RadialBar>
                <Tooltip />
                <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
              </RadialBarChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom marginBottom={5}>
                  Recent Conversation
                </Typography>
                <ul>
                  {conversation.map((item, index) => (
                    <li key={index} style={{ margin: 20, color: item.speaker === "human" ? "blue" : "green" }}>
                      {`${item.speaker}: ${item.message}`}
                    </li>
                  ))}
                </ul>
                <TableContainer sx={{marginTop: 10, marginBottom: 10}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Activity</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivityTableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.activity}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recentActivityChartData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
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
