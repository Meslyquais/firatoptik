import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    title: "Görüşünüz, stilinizin en keskin hali",
    subtitle: "Dünya markalarının seçilmiş koleksiyonu",
    cta: "Markaları Keşfet",
    ctaAction: "markalar",
    image:
      "https://images.unsplash.com/photo-1716596991057-4f54881371fa?crop=entropy&cs=srgb&fm=jpg&q=85",
    bgPosition: "center 25%",
  },
  {
    title: "Cam kalitesinde standart değil, seviye sunuyoruz",
    subtitle: "Netlik, koruma ve uzun ömür için ileri teknoloji lensler",
    cta: "Cam Teknolojisini İncele",
    ctaAction: "teknik",
    image:
      "https://images.pexels.com/photos/7066266/pexels-photo-7066266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    bgPosition: "center 20%",
  },
  {
    title: "Seçim değil, doğru eşleşme",
    subtitle: "Yüz yapınıza ve yaşam stilinize uygun öneriler",
    cta: "Randevu Al",
    ctaAction: "iletisim",
    image:
      "https://images.unsplash.com/photo-1587987746776-302404b98970?crop=entropy&cs=srgb&fm=jpg&q=85",
    bgPosition: "center 30%",
  },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-testid="hero-slider"
      className="relative h-screen w-full overflow-hidden"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${
            index === current
              ? "opacity-100 z-10"
              : "opacity-0 z-0"
          }`}
          style={{ transition: "opacity 0.7s ease-in-out" }}
        >
          <div
            className="absolute inset-0 bg-cover scale-105"
            style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.bgPosition }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-end pb-20 sm:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 w-full">
          <div className="max-w-2xl">
            <p
              data-testid="hero-subtitle"
              className="font-inter text-[11px] sm:text-xs tracking-[0.25em] text-white/60 uppercase mb-4 animate-fade-in stagger-1"
              style={{ opacity: 0 }}
              key={`sub-${current}`}
            >
              {slides[current].subtitle}
            </p>
            <h1
              data-testid="hero-title"
              className="font-playfair font-light text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-8 animate-fade-in stagger-2"
              style={{ opacity: 0 }}
              key={`title-${current}`}
            >
              {slides[current].title}
            </h1>
            <button
              data-testid="hero-cta"
              onClick={() => scrollTo(slides[current].ctaAction)}
              className="font-inter text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white border border-white/60 px-8 py-4 hover:bg-white hover:text-[#050505] animate-fade-in stagger-3"
              style={{ opacity: 0, transition: "background-color 0.3s, color 0.3s" }}
              key={`cta-${current}`}
            >
              {slides[current].cta}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            data-testid={`hero-dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`h-[2px] rounded-none ${
              index === current ? "bg-white w-10" : "bg-white/30 w-6"
            }`}
            style={{ transition: "width 0.4s, background-color 0.4s" }}
          />
        ))}
      </div>
    </section>
  );
};
