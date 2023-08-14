import { useState } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import Chatbot from "../components/chatbot";
import DBCard from "../sections/DBCard";

const Page = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      {!isConnected ? (
        <DBCard setIsConnected={setIsConnected} />
      ) : (
        <Chatbot setIsConnected={setIsConnected} />
      )}

      <Head>
        <title>Chatbot</title>
      </Head>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
