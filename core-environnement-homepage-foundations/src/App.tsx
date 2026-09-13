import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Commitments from "./components/Commitments";
import ClientPortal from "./components/ClientPortal";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import OrderModal from "./components/OrderModal";

export default function App() {
  const [orderOpen, setOrderOpen] = useState(false);
  const openOrder = () => setOrderOpen(true);

  return (
    <div className="min-h-screen bg-paper text-ink-900">
      <a
        href="#accueil"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-ink-900 focus:shadow-soft"
      >
        Aller au contenu principal
      </a>

      <Header onOrder={openOrder} />

      <main id="contenu">
        <Hero onOrder={openOrder} />
        <Services />
        <Commitments />
        <ClientPortal />
        <FinalCta onOrder={openOrder} />
      </main>

      <Footer onOrder={openOrder} />

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}
