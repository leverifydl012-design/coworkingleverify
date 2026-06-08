import logo1 from "@/assets/logo-1.png.asset.json";
import logo2 from "@/assets/logo-2.png.asset.json";
import logo3 from "@/assets/logo-3.png.asset.json";
import logo4 from "@/assets/logo-4.png.asset.json";
import logo5 from "@/assets/logo-5.png.asset.json";
import logo6 from "@/assets/logo-6.png.asset.json";

const companies = [
  { name: "Daraz", logo: logo1.url },
  { name: "Careem", logo: logo2.url },
  { name: "Bykea", logo: logo3.url },
  { name: "Foodpanda", logo: logo4.url },
  { name: "Systems Limited", logo: logo5.url },
  { name: "Tintash", logo: logo6.url },
];

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex w-max animate-marquee">
        {[...companies, ...companies].map((c, i) => (
          <div
            key={i}
            className="flex items-center mx-10 shrink-0"
            aria-hidden={i >= companies.length ? "true" : undefined}
          >
            <img
              src={c.logo}
              alt={c.name}
              className="h-32 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
