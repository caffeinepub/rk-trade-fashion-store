import { motion } from "motion/react";

interface HeroSectionProps {
  onShopNow: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      data-ocid="hero.section"
      style={{ minHeight: "520px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1200x600.jpg"
          alt="RK Trade Autumn Collection"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      </div>

      {/* Text overlay — left third */}
      <div className="relative z-10 flex flex-col justify-center min-h-[520px] max-w-[1400px] mx-auto px-8 md:px-16 py-16">
        <motion.div
          className="max-w-[380px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest3 text-gold mb-4">
            THE AUTUMN COLLECTION &rsquo;26
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.05] mb-6">
            Elevate Your Style
          </h1>
          <motion.button
            type="button"
            onClick={onShopNow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-8 py-3.5 bg-gold text-white font-sans text-[12px] font-semibold uppercase tracking-widest hover:bg-[#9A7F45] transition-colors"
            data-ocid="hero.primary_button"
          >
            SHOP NOW
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
