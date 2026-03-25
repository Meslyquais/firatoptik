import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ContactFooter = () => {
  const [settings, setSettings] = useState({
    phone: "+90 555 123 4567",
    whatsapp: "+905551234567",
    address: "Fırat Optik, İstanbul",
    email: "info@firatoptik.com",
  });

  useEffect(() => {
    axios
      .get(`${API}/settings`)
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  const whatsappNumber = settings.whatsapp
    ? settings.whatsapp.replace(/[^0-9]/g, "")
    : "905551234567";

  return (
    <footer
      id="iletisim"
      data-testid="contact-footer"
      className="bg-[#050505] text-white py-20 sm:py-24 px-6 sm:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <h2 className="font-inter font-thin tracking-[0.3em] text-base uppercase mb-6">
              FIRAT OPTİK
            </h2>
            <p className="font-inter font-light text-sm text-white/40 leading-[1.8] mb-8">
              Premium görme deneyimi ve moda kürasyonu. Kalite ve zarafetin
              buluşma noktası.
            </p>
            <img
              src="https://customer-assets.emergentagent.com/job_luxury-lens-gallery/artifacts/6vp80y5s_firat-optik-logo%404x.png"
              alt="Fırat Optik Logo"
              className="h-16 sm:h-20 object-contain"
              style={{ filter: "invert(1)" }}
            />
          </div>

          <div>
            <h3 className="font-inter text-[10px] tracking-[0.25em] text-white/40 mb-6">
              İLETİŞİM
            </h3>
            <div className="space-y-5">
              <a
                href={`tel:${settings.phone}`}
                data-testid="footer-phone"
                className="flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white"
                style={{ transition: "color 0.3s" }}
              >
                <Phone size={15} strokeWidth={1.5} />
                {settings.phone}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-whatsapp"
                className="flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white"
                style={{ transition: "color 0.3s" }}
              >
                <MessageCircle size={15} strokeWidth={1.5} />
                WhatsApp
              </a>
              <a
                href={`mailto:${settings.email}`}
                data-testid="footer-email"
                className="flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white"
                style={{ transition: "color 0.3s" }}
              >
                <Mail size={15} strokeWidth={1.5} />
                {settings.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-inter text-[10px] tracking-[0.25em] uppercase text-white/40 mb-6">
              ADRES
            </h3>
            <a
              href="https://maps.google.com/?q=F%C4%B1rat+Optik+R%C4%B1zvano%C4%9Flu+Karya+Nil%C3%BCfer+Bursa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 font-inter text-sm text-white/70 leading-relaxed hover:text-white"
              style={{ transition: "color 0.3s" }}
              data-testid="footer-address"
            >
              <MapPin size={15} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              {settings.address}
            </a>
            <div className="mt-6 overflow-hidden border border-white/10" style={{ borderRadius: 0 }}>
              <iframe
                title="Fırat Optik Konum"
                src="https://maps.google.com/maps?q=F%C4%B1rat+Optik+R%C4%B1zvano%C4%9Flu+Karya+%C4%B0hsaniye+Y%C3%BCce+Sk+Nil%C3%BCfer+Bursa&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                data-testid="footer-map"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-inter text-[10px] tracking-wider text-white/20">
            &copy; {new Date().getFullYear()} Fırat Optik. Tüm hakları
            saklıdır.
          </p>
          <a
            href="/admin/giris"
            data-testid="footer-admin-link"
            className="font-inter text-[10px] text-white/15 hover:text-white/40"
            style={{ transition: "color 0.3s" }}
          >
            Yönetim
          </a>
        </div>
      </div>
    </footer>
  );
};
