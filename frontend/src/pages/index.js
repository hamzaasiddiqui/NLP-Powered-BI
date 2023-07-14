import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useEffect, useState } from 'react';
import { OverviewCard } from 'src/sections/overview/overview-card';

const apiUrl = "http://localhost:5000";

const now = new Date();

const Page = () => {
  const [totalCustomers, setTotalCustomers] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [latestOrders, setLatestOrders] = useState(null);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    fetch(apiUrl + "/api/totalCustomers")
    .then(response => response.json()
    .then(data => {
      console.log(data['Total Customers'][0])
      const totalCustomersValue = data['Total Customers'][0];
      setTotalCustomers(totalCustomersValue);
      })
  )}, []);

  useEffect(() => {
    fetch(apiUrl + "/api/totalRevenue")
    .then(response => response.json()
    .then(data => {
      console.log(data['Total Revenue'][0])
      const totalRevenueValue = data['Total Revenue'][0];
      setTotalRevenue(totalRevenueValue);
    })
  )}, [])

  useEffect(() => {
    fetch(apiUrl + "/api/totalProfit")
    .then(response => response.json()
    .then(data => {
      console.log(data['Total Profit'][0])
      const totalProfitValue = data['Total Profit'][0];
      setTotalProfit(totalProfitValue);
    })
  )}, [])

  useEffect(() => {
    fetch(apiUrl + "/api/totalOrders")
    .then(response => response.json()
    .then(data => {
      console.log(data['Total Orders'][0])
      const totalOrdersValue = data['Total Orders'][0];
      setTotalOrders(totalOrdersValue);
    })
  )}, [])

  useEffect(() => {
    fetch(apiUrl + "/api/bestSellingProds")
    .then(response => response.json()
    .then(data => {
      console.log(data['Products'])
      const productsValue = data['Products'];
      console.log(productsValue)
      setTopProducts(productsValue);
      console.log(topProducts)
    })
  )}, [])

  // useEffect(() => {
  //   console.log(topProducts);
  // }, [topProducts]);

  useEffect(() => {
    fetch(apiUrl + "/api/latestOrders")
    .then(response => response.json()
    .then(data => {
      console.log(data['Latest Orders'])
      const ordersValue = data['Latest Orders'];
      console.log(ordersValue)
      setLatestOrders(ordersValue);
      console.log(latestOrders)
    })
  )}, [])

  useEffect(() => {
    fetch(apiUrl + "/api/revenuePerMonth")
    .then(response => response.json()
    .then(data => {
      console.log(data['Revenue'])
      const revenueValue = data['Revenue'];
      console.log(revenueValue)
      setRevenue(revenueValue);
      console.log(revenue)
    })
  )}, [])

  return (
    <>
    <Head>
      <title>
        Overview | Keystone
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewCard
              sx={{ height: '100%' }}
              title="Total Revenue"
              value={totalRevenue}
              symbol=" $"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewCard
              sx={{ height: '100%' }}
              title='Total Profit'
              value={totalProfit}
              symbol=" $"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewCard
              sx={{ height: '100%' }}
              title='Total Customers'
              value={totalCustomers}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewCard
              sx={{ height: '100%' }}
              title='Total Orders'
              value={totalOrders}
            />
          </Grid>
          <Grid
            xs={12}
            lg={8}
          >
            { revenue != null && (
            <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [revenue[13][1], revenue[14][1], revenue[15][1], revenue[16][1], 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                  name: 'Last year',
                  data: [revenue[0][1], revenue[1][1], revenue[2][1], revenue[3][1], revenue[4][1], revenue[5][1], revenue[6][1], revenue[7][1], revenue[8][1], revenue[9][1], revenue[10][1], revenue[11][1], revenue[12][1]]
                }
              ]}
              sx={{ height: '100%' }}
            />)}
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={['Desktop', 'Tablet', 'Phone']}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
          { topProducts != null && (
            <OverviewLatestProducts
              products={[
                {
                  id: topProducts[0][0],
                  name: topProducts[0][1],
                  revenue: topProducts[0][2]
                },
                {
                  id: topProducts[1][0],
                  name: topProducts[1][1],
                  revenue: topProducts[1][2]
                },
                {
                  id: topProducts[2][0],
                  name: topProducts[2][1],
                  revenue: topProducts[2][2]
                },
                {
                  id: topProducts[3][0],
                  name: topProducts[3][1],
                  revenue: topProducts[3][2]
                },
                {
                  id: topProducts[4][0],
                  name: topProducts[4][1],
                  revenue: topProducts[4][2]
                }
              ]}
              sx={{ height: '100%' }}
            />)}
          </Grid>
          
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            { latestOrders != null && (
            <OverviewLatestOrders
              orders={[
                {
                  id: 'f69f88012978187a6c12897f',
                  ref: latestOrders[0][0],
                  amount: 30.5,
                  customer: {
                    name: latestOrders[0][1]
                  },
                  createdAt: latestOrders[0][2],
                  status: latestOrders[0][3],
                },
                {
                  id: '9eaa1c7dd4433f413c308ce2',
                  ref: latestOrders[1][0],
                  amount: 25.1,
                  customer: {
                    name: latestOrders[1][1]
                  },
                  createdAt: latestOrders[1][2],
                  status: latestOrders[1][3]
                },
                {
                  id: '01a5230c811bd04996ce7c13',
                  ref: latestOrders[2][0],
                  amount: 10.99,
                  customer: {
                    name: latestOrders[2][1],
                  },
                  createdAt: latestOrders[2][2],
                  status: latestOrders[2][3]
                },
                {
                  id: '1f4e1bd0a87cea23cdb83d18',
                  ref: latestOrders[3][0],
                  amount: 96.43,
                  customer: {
                    name: latestOrders[3][1],
                  },
                  createdAt: latestOrders[3][2],
                  status: latestOrders[3][3],
                },
                {
                  id: '9f974f239d29ede969367103',
                  ref: latestOrders[4][0],
                  amount: 32.54,
                  customer: {
                    name: latestOrders[4][1],
                  },
                  createdAt: latestOrders[4][2],
                  status: latestOrders[4][3],
                },
                {
                  id: 'ffc83c1560ec2f66a1c05596',
                  ref: latestOrders[5][0],
                  amount: 16.76,
                  customer: {
                    name: latestOrders[5][1],
                  },
                  createdAt: latestOrders[5][2],
                  status: latestOrders[5][3],
                }
              ]}
              sx={{ height: '100%' }}
            />)}
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
