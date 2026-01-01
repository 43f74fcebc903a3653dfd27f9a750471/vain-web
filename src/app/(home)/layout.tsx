import { Footer } from "@/components/footer";
import { Container } from "@/components/gradient/container";
import Navbar from "@/components/nav/Navbar";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export default function vainMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative bg-vain-900">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
