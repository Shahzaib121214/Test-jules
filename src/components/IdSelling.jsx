import { motion } from 'framer-motion';
import { Shield, Star, Clock, ChevronRight } from 'lucide-react';

const ACCOUNTS = [
  {
    id: 1,
    title: "MAX Level Elite Pass S1-S10",
    level: 82,
    rank: "Grandmaster",
    likes: "45K+",
    price: "$299",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Sakura Bundle + Criminal",
    level: 75,
    rank: "Heroic",
    likes: "22K+",
    price: "$149",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "V-Badge Verified Account",
    level: 80,
    rank: "Master",
    likes: "99K+",
    price: "$899",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop",
    featured: true
  },
  {
    id: 4,
    title: "Evo Gun Max Level x5",
    level: 71,
    rank: "Diamond IV",
    likes: "15K+",
    price: "$120",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    featured: false
  }
];

const IdSelling = () => {
  return (
    <section className="py-20 bg-ff-dark relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-2">
              Premium <span className="ff-gradient-text">Accounts</span>
            </h2>
            <p className="text-gray-400">Secure, verified, and ready to dominate.</p>
          </div>

          <button className="hidden md:flex items-center gap-1 text-ff-yellow hover:text-white transition-colors uppercase font-bold">
            View All <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCOUNTS.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-ff-panel rounded-xl overflow-hidden border ${account.featured ? 'border-ff-yellow' : 'border-gray-800'} group hover:border-ff-orange transition-colors duration-300 relative`}
            >
              {account.featured && (
                <div className="absolute top-3 left-3 z-10 bg-ff-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Featured
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-ff-panel to-transparent z-10"></div>
                <img
                  src={account.image}
                  alt={account.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-gray-600">
                    Lv. {account.level}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm text-ff-orange text-xs px-2 py-1 rounded border border-gray-600 font-bold">
                    {account.rank}
                  </span>
                </div>
              </div>

              <div className="p-5 relative">
                <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-ff-yellow transition-colors">{account.title}</h3>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-ff-yellow" />
                    <span>Safe Guard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-ff-orange" />
                    <span>{account.likes} Likes</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock size={14} className="text-green-500" />
                    <span>Instant Transfer</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <span className="text-2xl font-black text-white">{account.price}</span>
                  <button className="bg-ff-darker hover:bg-ff-orange text-white font-bold py-2 px-4 rounded transition-colors text-sm uppercase">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="md:hidden mt-8 w-full flex items-center justify-center gap-1 text-ff-yellow border border-ff-yellow py-3 rounded-lg hover:bg-ff-yellow hover:text-black transition-colors uppercase font-bold">
          View All Accounts <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default IdSelling;
