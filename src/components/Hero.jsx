import { motion } from 'framer-motion';
import { ShoppingCart, Flame } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-ff-darker">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ff-orange/30 via-ff-darker to-ff-darker"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="text-ff-orange w-8 h-8" />
              <span className="text-ff-yellow tracking-[0.2em] font-bold uppercase text-sm">Elite Gaming Marketplace</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase leading-none italic">
              Level Up <br/>
              <span className="ff-gradient-text">Your Game</span>
            </h1>

            <p className="text-gray-400 text-xl mb-8 max-w-lg">
              Premium Free Fire accounts, exclusive skins, diamonds, and top-tier bundles. Safe, secure, and instant delivery.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="ff-btn flex items-center gap-2 text-lg">
                <ShoppingCart size={20} />
                Explore Store
              </button>
              <button className="border-2 border-ff-yellow text-ff-yellow font-bold py-2 px-6 rounded-md hover:bg-ff-yellow hover:text-black transition-all duration-300 transform hover:scale-105">
                Sell Account
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            {/* 3D Asset Placeholder / Hero Image */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-tr from-ff-orange/20 to-ff-yellow/20 rounded-full blur-3xl absolute top-0 left-0"
              />
              <div className="w-full h-full relative z-10 flex items-center justify-center">
                 {/* Replace with actual 3D character render */}
                 <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Character"
                    className="w-[80%] h-[80%] object-cover rounded-2xl clip-path-slant shadow-2xl border-4 border-ff-orange/50"
                 />

                 {/* Floating Badges */}
                 <motion.div
                   animate={{ y: [0, 10, 0] }}
                   transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                   className="absolute top-10 -right-4 bg-ff-panel p-3 rounded-lg border border-ff-yellow/30 shadow-lg flex items-center gap-3"
                 >
                   <div className="w-10 h-10 bg-ff-yellow rounded-full flex items-center justify-center text-black font-black">V</div>
                   <div>
                     <p className="text-xs text-gray-400">Verified</p>
                     <p className="font-bold text-sm">Sellers</p>
                   </div>
                 </motion.div>

                 <motion.div
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
                   className="absolute bottom-10 -left-4 bg-ff-panel p-3 rounded-lg border border-ff-orange/30 shadow-lg flex items-center gap-3"
                 >
                   <div className="w-10 h-10 bg-ff-orange rounded-full flex items-center justify-center text-black font-black">⚡</div>
                   <div>
                     <p className="text-xs text-gray-400">Instant</p>
                     <p className="font-bold text-sm">Delivery</p>
                   </div>
                 </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative slant bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-ff-dark clip-path-slant z-20 translate-y-8"></div>
    </div>
  );
};

export default Hero;
