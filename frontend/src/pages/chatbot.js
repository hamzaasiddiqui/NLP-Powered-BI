import { useState, useEffect } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import Chatbot from "../components/chatbot";
import DBCard from "../sections/DBCard";

const Page = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isConnected, setIsConnected] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/isConnected");
        console.log(response.data['connection']);
        setIsConnected(response.data['connection']);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [databaseUrl]); 

  return (
    <>
      {isConnected === 'true' || isConnected === true ? (
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
