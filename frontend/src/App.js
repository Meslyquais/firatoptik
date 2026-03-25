import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import BrandPage from "@/pages/BrandPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        data-testid="loading-screen"
        className={`fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center transition-opacity duration-700 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="font-inter font-thin tracking-[0.3em] text-white text-2xl sm:text-4xl uppercase select-none">
          FIRAT OPTİK
        </h1>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marka/:slug" element={<BrandPage />} />
          <Route path="/admin/giris" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
