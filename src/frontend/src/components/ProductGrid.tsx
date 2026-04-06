import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { Category, Product } from "../backend.d";
import { type SampleProduct, sampleProducts } from "../data/sampleProducts";
import { useProducts, useProductsByCategory } from "../hooks/useQueries";
import ProductCard from "./ProductCard";

type CardProduct = Product | SampleProduct;

const CATEGORY_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  newArrivals: "New Arrivals",
  sale: "Sale",
};

interface ProductGridProps {
  category: Category | null;
  onProductClick: (product: CardProduct) => void;
  title?: string;
}

export default function ProductGrid({
  category,
  onProductClick,
  title,
}: ProductGridProps) {
  const allProductsQuery = useProducts();
  const categoryProductsQuery = useProductsByCategory(category);

  const query = category ? categoryProductsQuery : allProductsQuery;
  const { isLoading } = query;

  const products = useMemo<CardProduct[]>(() => {
    if (query.data && query.data.length > 0) {
      return query.data;
    }
    // Use sample products as fallback while loading or if empty
    if (!category) return sampleProducts;
    return sampleProducts.filter((p) => p.category === category);
  }, [query.data, category]);

  const heading =
    title ||
    (category ? CATEGORY_LABELS[category] || category : "ALL PRODUCTS");

  return (
    <section
      className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12"
      data-ocid="products.section"
    >
      {/* Section header */}
      <div className="text-center mb-10">
        <h2 className="font-sans text-[14px] font-bold uppercase tracking-widest2 text-nearblack">
          {heading}
        </h2>
        <div className="w-12 h-px bg-gold mx-auto mt-3" />
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="products.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-16 bg-[#F7F6F2]"
          data-ocid="products.empty_state"
        >
          <p className="font-display text-lg text-nearblack mb-2">
            No products found
          </p>
          <p className="font-sans text-sm text-[#7A7A7A]">
            Check back soon for new arrivals
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          data-ocid="products.list"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: "easeOut" },
                },
              }}
            >
              <ProductCard
                product={product}
                index={i + 1}
                onProductClick={onProductClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
