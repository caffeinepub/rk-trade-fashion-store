import { Loader2, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import type { SampleProduct } from "../data/sampleProducts";
import { formatPrice, useSearchProducts } from "../hooks/useQueries";

type CardProduct = Product | SampleProduct;

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onProductClick: (p: CardProduct) => void;
}

export default function SearchModal({
  open,
  onClose,
  onProductClick,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useSearchProducts(query);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl"
            data-ocid="search.modal"
          >
            <div className="max-w-[800px] mx-auto px-4 py-5">
              <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                <Search className="w-5 h-5 text-[#7A7A7A] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  // biome-ignore lint/a11y/noAutofocus: search modal requires immediate focus for UX
                  autoFocus
                  className="flex-1 font-sans text-base text-nearblack placeholder-[#7A7A7A] outline-none bg-transparent"
                  data-ocid="search.input"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-[#7A7A7A] hover:text-nearblack transition-colors"
                  data-ocid="search.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              {query.trim().length >= 2 && (
                <div
                  className="py-4 max-h-80 overflow-y-auto"
                  data-ocid="search.list"
                >
                  {isLoading ? (
                    <div
                      className="flex justify-center py-8"
                      data-ocid="search.loading_state"
                    >
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : results && results.length > 0 ? (
                    <ul className="space-y-1">
                      {results.map((product, i) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onProductClick(product);
                              onClose();
                            }}
                            className="w-full flex items-center gap-4 px-3 py-3 hover:bg-[#F7F6F2] transition-colors text-left"
                            data-ocid={`search.item.${i + 1}`}
                          >
                            <span className="font-sans text-sm text-nearblack">
                              {product.name}
                            </span>
                            <span className="ml-auto font-sans text-sm text-gold font-medium">
                              {formatPrice(product.price)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className="text-center font-sans text-sm text-[#7A7A7A] py-8"
                      data-ocid="search.empty_state"
                    >
                      No products found for &ldquo;{query}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
