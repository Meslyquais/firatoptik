import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { ContactFooter } from "../components/ContactFooter";
import { ArrowLeft } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BG_POSITIONS = {
  "gucci": "center 15%",
  "prada": "center 15%",
  "dior": "center 25%",
  "tom-ford": "center 20%",
  "miu-miu": "center 20%",
  "celine": "center 30%",
  "fendi": "center 25%",
  "persol": "center 30%",
};

export default function BrandPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/brands/${slug}`)
      .then((r) => {
        setBrand(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[100]">
        <h1
          data-testid="brand-loading"
          className="text-white font-playfair font-light tracking-wider text-3xl sm:text-5xl animate-pulse"
        >
          {slug?.replace(/-/g, " ").toUpperCase()}
        </h1>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-playfair font-light text-3xl text-[#050505] mb-4">
            Marka Bulunamadı
          </h1>
          <Link
            to="/"
            className="font-inter text-sm text-[#555] hover:text-[#050505]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="brand-page" className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${brand.image_url})`, backgroundPosition: BG_POSITIONS[slug] || "center center" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-end pb-12 sm:pb-16 px-6 sm:px-12">
          <div className="max-w-[1440px] mx-auto w-full">
            <Link
              to="/"
              data-testid="back-to-home"
              className="inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.2em] text-white/60 hover:text-white uppercase mb-6"
              style={{ transition: "color 0.3s" }}
            >
              <ArrowLeft size={14} />
              Ana Sayfa
            </Link>
            <h1
              data-testid="brand-page-title"
              className="font-playfair font-light text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight mb-3 leading-[1.05]"
            >
              {brand.name}
            </h1>
            <p className="font-inter font-light text-sm text-white/60 max-w-lg leading-relaxed">
              {brand.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 sm:px-12">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-inter text-[10px] tracking-[0.3em] text-[#AAAAAA] uppercase mb-2">
            Koleksiyon
          </p>
          <div className="w-12 h-[1px] bg-[#E5E5E5] mb-12" />

          {brand.products && brand.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {brand.products.map((product) => (
                <div
                  key={product.id}
                  data-testid={`product-card-${product.id}`}
                  className="group"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-5 bg-[#FAFAFA]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                      style={{ transition: "filter 0.5s ease, transform 0.5s ease" }}
                    />
                  </div>
                  <h3 className="font-inter text-sm tracking-wide text-[#050505] mb-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="font-inter text-xs text-[#999] mb-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.price && (
                    <p className="font-inter text-sm font-medium text-[#050505] mt-2">
                      {product.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div data-testid="no-products" className="py-24 text-center">
              <p className="font-playfair font-light text-2xl sm:text-3xl text-[#050505] mb-3">
                Koleksiyon Hazırlanıyor
              </p>
              <p className="font-inter text-sm text-[#999]">
                Bu markanın ürünleri yakında eklenecektir.
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactFooter />
    </div>
  );
}
