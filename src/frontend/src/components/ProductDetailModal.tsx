import { Loader2, Package, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import type { SampleProduct } from "../data/sampleProducts";
import { formatPrice, useAddToCart } from "../hooks/useQueries";

type CardProduct = Product | SampleProduct;

function isBackendProduct(p: CardProduct): p is Product {
  return (
    "image" in p &&
    typeof (p as Product).image === "object" &&
    (p as Product).image !== null &&
    "getDirectURL" in (p as Product).image
  );
}

function getProductImage(p: CardProduct): string {
  if (isBackendProduct(p)) {
    try {
      return p.image.getDirectURL();
    } catch {
      return "/assets/generated/product-denim.dim_400x500.jpg";
    }
  }
  return (p as SampleProduct).image;
}

interface ProductDetailModalProps {
  product: CardProduct | null;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(
      { id: product.id, size: selectedSize, quantity: BigInt(1) },
      {
        onSuccess: () => {
          toast.success(`${product.name} added to cart`);
          onClose();
        },
        onError: () => toast.error("Failed to add to cart. Please log in."),
      },
    );
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      men: "Men",
      women: "Women",
      kids: "Kids",
      newArrivals: "New Arrivals",
      sale: "Sale",
    };
    return map[cat] || cat;
  };

  return (
    <AnimatePresence>
      {product && (
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
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="product.modal"
          >
            <div className="bg-white w-full max-w-[860px] max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-[#7A7A7A] hover:text-nearblack transition-colors bg-white rounded-full shadow-sm"
                aria-label="Close"
                data-ocid="product.close_button"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="w-full md:w-[45%] bg-[#F7F6F2] aspect-[4/5] md:aspect-auto flex-shrink-0">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 p-8 flex flex-col gap-5">
                <div>
                  <span className="font-sans text-[11px] text-gold font-semibold uppercase tracking-widest">
                    {getCategoryLabel(product.category as string)}
                  </span>
                  <h2 className="font-display text-3xl font-semibold text-nearblack mt-1 leading-tight">
                    {product.name}
                  </h2>
                  <p className="font-display text-2xl font-medium text-gold mt-2">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <p className="font-sans text-sm text-[#3A3A3A] leading-relaxed">
                  {product.description}
                </p>

                {/* Stock indicator */}
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#7A7A7A]" />
                  <span className="font-sans text-xs text-[#7A7A7A]">
                    {Number(product.stock) > 10
                      ? "In Stock"
                      : Number(product.stock) > 0
                        ? `Only ${product.stock} left`
                        : "Out of Stock"}
                  </span>
                </div>

                {/* Size selector */}
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-nearblack mb-2">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSize(selectedSize === size ? "" : size)
                        }
                        className={`px-4 py-2 border font-sans text-[12px] font-medium transition-colors ${
                          selectedSize === size
                            ? "border-nearblack bg-nearblack text-white"
                            : "border-[#E5E5E5] text-nearblack hover:border-nearblack"
                        }`}
                        data-ocid="product.size.button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isPending || Number(product.stock) === 0}
                  className="w-full py-4 bg-gold text-white font-sans text-[12px] font-semibold uppercase tracking-widest hover:bg-[#9A7F45] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-auto"
                  data-ocid="product.submit_button"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  {Number(product.stock) === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
