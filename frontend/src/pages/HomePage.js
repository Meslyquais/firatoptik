import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { HeroSlider } from "../components/HeroSlider";
import { BrandMarquee } from "../components/BrandMarquee";
import { EditorialBrandBlock } from "../components/EditorialBrandBlock";
import { TechnicalExcellence } from "../components/TechnicalExcellence";
import { ContactFooter } from "../components/ContactFooter";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function HomePage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/brands`)
      .then((r) => setBrands(r.data))
      .catch(console.error);
  }, []);

  return (
    <div data-testid="home-page">
      <Navbar />
      <HeroSlider />
      <BrandMarquee />

      <section id="markalar" data-testid="brands-section" className="bg-white">
        <div className="py-16 sm:py-24 px-6 sm:px-12 max-w-[1440px] mx-auto">
          <p className="font-inter text-[10px] tracking-[0.3em] text-[#AAAAAA] uppercase mb-4">
            The Icons
          </p>
          <h2 className="font-playfair font-light text-3xl sm:text-5xl text-[#050505] tracking-tight">
            Dünya Markaları
          </h2>
        </div>
        <div>
          {brands.map((brand, index) => (
            <EditorialBrandBlock key={brand.id} brand={brand} index={index} total={brands.length} />
          ))}
        </div>
      </section>

      <TechnicalExcellence />
      <ContactFooter />
    </div>
  );
}
