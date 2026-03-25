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
"Bausch + Lomb"];


export const BrandMarquee = () => {
  return (
    <section
      data-testid="brand-marquee"
      className="py-6 border-y border-[#E5E5E5] bg-white">

      <Marquee speed={25} gradient={false} pauseOnHover>
        {brands.map((brand, i) =>
        <span
          key={i}
          className="font-inter uppercase select-none !font-light !text-[20px] !tracking-[0.3em] mx-10 sm:mx-16 text-[#AAAAAA]">

            {brand}
          </span>
        )}
      </Marquee>
    </section>);

};