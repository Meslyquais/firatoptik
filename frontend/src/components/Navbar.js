import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollTo = (id) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5]"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between h-20">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_luxury-lens-gallery/artifacts/oua3ymc2_firat-optik-wordmark%404x.png"
            alt="Fırat Optik"
            className="h-5 sm:h-6 object-contain"
          />
          <img
            src="https://customer-assets.emergentagent.com/job_luxury-lens-gallery/artifacts/bcwgjwjz_firat-optik-icon%404x.png"
            alt=""
            className="h-5 sm:h-6 object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollTo("markalar")}
            data-testid="nav-brands"
            className="font-inter text-[11px] tracking-[0.2em] text-[#555] hover:text-[#050505]"
            style={{ transition: "color 0.3s" }}
          >
            MARKALAR
          </button>
          <button
            onClick={() => scrollTo("teknik")}
            data-testid="nav-tech"
            className="font-inter text-[11px] tracking-[0.2em] text-[#555] hover:text-[#050505]"
            style={{ transition: "color 0.3s" }}
          >
            TEKNİK
          </button>
          <button
            onClick={() => scrollTo("iletisim")}
            data-testid="nav-contact"
            className="font-inter text-[11px] tracking-[0.2em] text-[#555] hover:text-[#050505]"
            style={{ transition: "color 0.3s" }}
          >
            İLETİŞİM
          </button>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden bg-white border-t border-[#E5E5E5] px-6 py-8 space-y-6"
        >
          <button
            onClick={() => scrollTo("markalar")}
            className="block w-full text-left font-inter text-sm tracking-[0.2em] text-[#050505]"
          >
            MARKALAR
          </button>
          <button
            onClick={() => scrollTo("teknik")}
            className="block w-full text-left font-inter text-sm tracking-[0.2em] text-[#050505]"
          >
            TEKNİK
          </button>
          <button
            onClick={() => scrollTo("iletisim")}
            className="block w-full text-left font-inter text-sm tracking-[0.2em] text-[#050505]"
          >
            İLETİŞİM
          </button>
        </div>
      )}
    </nav>
  );
};
