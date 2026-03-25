import Marquee from "react-fast-marquee";

const brands = [
  "Zeiss",
  "Essilor",
  "Hoya",
  "Seiko",
  "Nikon",
  "Rodenstock",
  "Lindberg",
  "Silhouette",
  "Serengeti",
  "Lafont",
  "Morel",
  "Minima",
  "Lool",
  "Movitra",
  "Acuvue",
  "Bausch + Lomb",
];

export const BrandMarquee = () => {
  return (
    <section
      data-testid="brand-marquee"
      className="py-6 border-y border-[#E5E5E5] bg-white"
    >
      <Marquee speed={25} gradient={false} pauseOnHover>
        {brands.map((brand, i) => (
          <span
            key={i}
            className="font-inter font-light text-[11px] tracking-[0.3em] text-[#AAAAAA] uppercase mx-10 sm:mx-16 select-none"
          >
            {brand}
          </span>
        ))}
      </Marquee>
    </section>
  );
};
