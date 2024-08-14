import MainCard from "@/components/pages/ProfileCard/MainCard";
import Layout from "../components/Navbar/Navbar";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Layout />
        <MainCard />
      </Suspense>
    </>
  );
}
