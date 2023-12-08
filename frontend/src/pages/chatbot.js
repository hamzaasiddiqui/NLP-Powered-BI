import { useState, useEffect } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import Chatbot from "../components/chatbot";
import DBCard from "../sections/DBCard";

const Page = () => {
  // Load initial state from local storage if available
  const initialIsConnected = localStorage.getItem("isConnected") === "true";
  const [isConnected, setIsConnected] = useState(initialIsConnected);
  const [databaseUrl, setDatabaseUrl] = useState("");

  // Update local storage whenever isConnected changes
  useEffect(() => {
    localStorage.setItem("isConnected", isConnected);
  }, [isConnected]);

  return (
    <>
      {isConnected && databaseUrl? (
        <Chatbot setIsConnected={setIsConnected} databaseUrl={databaseUrl}/>
      ) : (
        <DBCard setIsConnected={setIsConnected} setDatabaseUrl={setDatabaseUrl}/>
      )}

      <Head>
        <title>Chatbot | Keystone</title>
      </Head>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
