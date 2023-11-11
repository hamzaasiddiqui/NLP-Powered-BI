import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
const apiUrl = "http://localhost:5000";

const now = new Date();

const Page = () => {
  return (
    <>
    <Head>
      <title>
        Overview | Keystone
      </title>
    </Head>
  </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
