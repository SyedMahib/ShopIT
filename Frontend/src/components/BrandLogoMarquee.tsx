export interface BrandLogoMarqueeProps {
  brands?: string[];
  heading?: string;
}

const defaultBrands = ["ASUS", "MSI", "Intel", "NVIDIA", "Corsair", "Logitech"];

const BrandLogoMarquee = ({
  brands = defaultBrands,
  heading = "Brands customers know and trust",
}: BrandLogoMarqueeProps) => {
  return (
    <section className="border-b border-slate-200 bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {heading}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-bold tracking-wide text-slate-500 grayscale transition hover:text-slate-800 hover:grayscale-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogoMarquee;
