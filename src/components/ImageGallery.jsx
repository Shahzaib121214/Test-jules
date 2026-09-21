import { motion } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=2067&auto=format&fit=crop"
];

const ImageGallery = () => {
  return (
    <section className="py-20 bg-ff-darker overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-2">
          Epic <span className="ff-gradient-text">Showcase</span>
        </h2>
        <p className="text-gray-400">Exclusive bundles, rare skins, and legendary moments.</p>
      </div>

      {/* Infinite scrolling marquee effect */}
      <div className="relative w-full flex overflow-x-hidden group">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-ff-darker to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-ff-darker to-transparent z-10"></div>

        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...IMAGES, ...IMAGES].map((src, index) => (
            <div
              key={index}
              className="w-[300px] md:w-[400px] h-[200px] md:h-[250px] mx-4 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-transparent hover:border-ff-orange transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="absolute inset-0 bg-ff-orange/20 mix-blend-overlay hover:opacity-0 transition-opacity duration-300"></div>
              <img
                src={src}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Marquee - Added here via Tailwind arbitrary values or inline style for simplicity */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default ImageGallery;
