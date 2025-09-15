import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Portfolio from "./Pages/Portfolio";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";

const pageNames = {
  Home: "Home",
  Portfolio: "Portfolio",
  About: "About",
  Services: "Services",
  Contact: "Contact"
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout currentPageName={pageNames.Home}><Home /></Layout>} />
        <Route path="/portfolio" element={<Layout currentPageName={pageNames.Portfolio}><Portfolio /></Layout>} />
        <Route path="/about" element={<Layout currentPageName={pageNames.About}><About /></Layout>} />
        <Route path="/services" element={<Layout currentPageName={pageNames.Services}><Services /></Layout>} />
        <Route path="/contact" element={<Layout currentPageName={pageNames.Contact}><Contact /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
