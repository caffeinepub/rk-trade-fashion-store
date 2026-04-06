import { Loader2, ShoppingBag } from "lucide-react";
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

interface ProductCardProps {
  product: CardProduct;
  index: number;
  onProductClick: (product: CardProduct) => void;
}

export default function ProductCard({
  product,
  index,
  onProductClick,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    addToCart(
      { id: product.id, size: selectedSize, quantity: BigInt(1) },
      {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: () => toast.error("Failed to add to cart. Please log in."),
      },
    );
  };

  const imgSrc = getProductImage(product);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: product card click-to-open is paired with CTA button
    <article
      className="group bg-white flex flex-col cursor-pointer"
      onClick={() => onProductClick(product)}
      data-ocid={`products.item.${index}`}
    >
      {/* Image */}
      <div className="overflow-hidden bg-[#F7F6F2] product-image-zoom aspect-[4/5]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="pt-3 pb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-[13px] font-medium text-nearblack leading-tight">
            {product.name}
          </h3>
          <span className="font-sans text-[13px] font-semibold text-gold">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Size selector */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation container */}
        <div
          className="flex flex-wrap gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSize(selectedSize === size ? "" : size);
              }}
              className={`text-[10px] font-medium px-1.5 py-0.5 border transition-colors ${
                selectedSize === size
                  ? "border-nearblack bg-nearblack text-white"
                  : "border-[#E5E5E5] text-[#7A7A7A] hover:border-nearblack hover:text-nearblack"
              }`}
              data-ocid="product.size.button"
            >
              {size}
            </button>
          ))}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className="mt-1 w-full py-2 bg-[#2F2F2F] text-white font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          data-ocid={`products.item.${index}.button`}
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
          ADD TO CART
        </button>
      </div>
    </article>
  );
}
