import { Link } from "react-router-dom";

export const EditorialBrandBlock = ({ brand, index }) => {
  const isEven = index % 2 === 0;
  const isTall = index % 3 === 0;

  return (
    <Link
      to={`/marka/${brand.slug}`}
      data-testid={`brand-block-${brand.slug}`}
      className="group block relative w-full overflow-hidden"
      style={{ height: isTall ? "80vh" : "65vh", minHeight: "400px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105"
        style={{
          backgroundImage: `url(${brand.image_url})`,
          transition: "filter 0.7s ease, transform 0.7s ease",
        }}
      />

      <div
        className="absolute inset-0 bg-black/35 group-hover:bg-black/20"
        style={{ transition: "background-color 0.5s ease" }}
      />

      <div
        className={`relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 lg:p-20 ${
          isEven ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <p className="font-inter text-[10px] tracking-[0.3em] text-white/40 uppercase mb-3">
          {String(index + 1).padStart(2, "0")} / 12
        </p>
        <h2
          data-testid={`brand-name-${brand.slug}`}
          className="font-playfair font-light text-3xl sm:text-5xl lg:text-7xl text-white tracking-tight mb-3 leading-[1.05]"
        >
          {brand.name}
        </h2>
        <p
          className={`font-inter text-xs sm:text-sm text-white/60 tracking-wide mb-8 max-w-md leading-relaxed ${
            isEven ? "" : "ml-auto"
          }`}
        >
          {brand.description}
        </p>
        <span
          data-testid={`brand-cta-${brand.slug}`}
          className="inline-block font-inter text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white border border-white/40 px-8 sm:px-12 py-3 sm:py-4 group-hover:bg-white group-hover:text-[#050505] group-hover:border-white"
          style={{ transition: "background-color 0.3s, color 0.3s, border-color 0.3s" }}
        >
          {brand.button_text}
        </span>
      </div>
    </Link>
  );
};
