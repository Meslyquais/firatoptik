export const TechnicalExcellence = () => {
  return (
    <section
      id="teknik"
      data-testid="technical-section"
      className="bg-white py-24 sm:py-32 px-6 sm:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-16 sm:mb-24">
          <p className="font-inter text-[10px] tracking-[0.3em] text-[#AAAAAA] uppercase mb-4">
            Teknik Mükemmellik
          </p>
          <h2 className="font-playfair font-light text-3xl sm:text-5xl text-[#050505] tracking-tight max-w-3xl leading-[1.1]">
            Kusursuz Görüşün Mühendisliği
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-12 order-2 lg:order-1">
            <div>
              <h3 className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#050505] mb-4">
                Kişiye Özel Cam Kesimi
              </h3>
              <p className="font-inter font-light text-sm text-[#555] leading-[1.8]">
                Her göz farklıdır. Fırat Optik'te camlarınız, reçetenize ve
                kullanım alışkanlıklarınıza göre birebir hesaplanarak kesilir.
                Standart değil, size özel.
              </p>
            </div>
            <div>
              <h3 className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#050505] mb-4">
                İleri Teknoloji Lensler
              </h3>
              <p className="font-inter font-light text-sm text-[#555] leading-[1.8]">
                Nikon, Seiko ve Rodenstock gibi dünyanın en prestijli lens
                üreticilerinin teknolojilerini kullanıyoruz. Mavi ışık filtresi,
                anti-refleks kaplama ve UV koruma standart donanımımızdır.
              </p>
            </div>
            <div>
              <h3 className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#050505] mb-4">
                Uzun Ömürlü Performans
              </h3>
              <p className="font-inter font-light text-sm text-[#555] leading-[1.8]">
                Camlarımız çizilmeye karşı dayanıklı, kolay temizlenebilir ve
                yıllarca ilk günkü netliğini koruyacak şekilde üretilir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-14 sm:gap-20 pt-8 border-t border-[#E5E5E5]">
              <svg viewBox="0 0 160 40" className="h-8 sm:h-11" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="32" fill="#050505" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="32" letterSpacing="2">NIKON</text>
              </svg>
              <svg viewBox="0 0 130 40" className="h-8 sm:h-11" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="32" fill="#050505" fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="32" letterSpacing="5">ZEISS</text>
              </svg>
              <svg viewBox="0 0 160 40" className="h-8 sm:h-11" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="32" fill="#050505" fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="30" letterSpacing="4">SEIKO</text>
              </svg>
              <svg viewBox="0 0 310 40" className="h-8 sm:h-11" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="32" fill="#050505" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="28" letterSpacing="3">RODENSTOCK</text>
              </svg>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1652155379208-ec6cdc8b7951?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Optik lens teknolojisi"
                className="w-full h-full object-cover grayscale hover:grayscale-0"
                style={{ transition: "filter 0.7s ease" }}
                data-testid="tech-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
