import { motion } from "motion/react";

interface FeaturedCollectionsProps {
  onDenimClick: () => void;
  onKnitwearClick: () => void;
}

export default function FeaturedCollections({
  onDenimClick,
  onKnitwearClick,
}: FeaturedCollectionsProps) {
  return (
    <section
      className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12"
      data-ocid="collections.section"
    >
      <div className="text-center mb-10">
        <h2 className="font-sans text-[14px] font-bold uppercase tracking-widest2 text-nearblack">
          FEATURED COLLECTIONS
        </h2>
        <div className="w-12 h-px bg-gold mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Denim Edit */}
        <motion.div
          className="relative overflow-hidden cursor-pointer group"
          style={{ minHeight: "320px" }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          onClick={onDenimClick}
          data-ocid="collections.item.1"
        >
          <img
            src="/assets/generated/collection-denim.dim_600x400.jpg"
            alt="The Denim Edit"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[320px] text-center p-8">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest3 text-white/70 mb-3">
              COLLECTION
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              THE DENIM EDIT
            </h3>
            <button
              type="button"
              onClick={onDenimClick}
              className="px-6 py-2.5 border border-gold text-gold font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors"
              data-ocid="collections.item.1.button"
            >
              SHOP NOW
            </button>
          </div>
        </motion.div>

        {/* Cozy Knitwear */}
        <motion.div
          className="relative overflow-hidden cursor-pointer group"
          style={{ minHeight: "320px" }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          onClick={onKnitwearClick}
          data-ocid="collections.item.2"
        >
          <img
            src="/assets/generated/collection-knitwear.dim_600x400.jpg"
            alt="Cozy Knitwear"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[320px] text-center p-8">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest3 text-white/70 mb-3">
              COLLECTION
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              COZY KNITWEAR
            </h3>
            <button
              type="button"
              onClick={onKnitwearClick}
              className="px-6 py-2.5 border border-gold text-gold font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors"
              data-ocid="collections.item.2.button"
            >
              SHOP NOW
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
