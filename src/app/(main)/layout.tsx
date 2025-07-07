import Footer from "@/components/general/footer/footer";
import Navbar from "@/components/general/navbar/navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
