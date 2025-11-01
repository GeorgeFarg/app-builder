import React from "react";
import Landing from "../layouts/Landing";
import Footer from "@/components/Footer";

const Home = () => {
  return (

  <div className="min-h-screen bg-[#0D051A] text-white overflow-hidden font-sans">
            <main className="relative z-10">
                <Landing/>
            </main>
            <Footer />
        </div>
  );
};

export default Home;
