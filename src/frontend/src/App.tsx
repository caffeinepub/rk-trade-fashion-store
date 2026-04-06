import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import type { Category, Product } from "./backend.d";
import AccountPanel from "./components/AccountPanel";
import AdminPanel from "./components/AdminPanel";
import CartDrawer from "./components/CartDrawer";
import FeaturedCollections from "./components/FeaturedCollections";
import FooterSection from "./components/FooterSection";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductDetailModal from "./components/ProductDetailModal";
import ProductGrid from "./components/ProductGrid";
import SearchModal from "./components/SearchModal";
import type { SampleProduct } from "./data/sampleProducts";
import { useIsAdmin } from "./hooks/useQueries";

type CardProduct = Product | SampleProduct;

const INSTAGRAM_IMAGES = [
  {
    src: "/assets/generated/product-denim.dim_400x500.jpg",
    alt: "RK Trade Instagram 1",
  },
  {
    src: "/assets/generated/product-dress.dim_400x500.jpg",
    alt: "RK Trade Instagram 2",
  },
  {
    src: "/assets/generated/product-sweater.dim_400x500.jpg",
    alt: "RK Trade Instagram 3",
  },
  {
    src: "/assets/generated/product-shirt.dim_400x500.jpg",
    alt: "RK Trade Instagram 4",
  },
  {
    src: "/assets/generated/product-trousers.dim_400x500.jpg",
    alt: "RK Trade Instagram 5",
  },
];

type View = "home" | "products" | "admin";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CardProduct | null>(
    null,
  );

  const { data: isAdmin } = useIsAdmin();

  const handleCategorySelect = useCallback((cat: Category | null) => {
    setSelectedCategory(cat);
    setView("products");
  }, []);

  const handleLogoClick = useCallback(() => {
    setView("home");
    setSelectedCategory(null);
  }, []);

  const handleShopNow = useCallback(() => {
    setView("products");
    setSelectedCategory(null);
  }, []);

  const handleProductClick = useCallback((product: CardProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleProductClose = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleLoginRequest = useCallback(() => {
    setCartOpen(false);
    setAccountOpen(true);
  }, []);

  const handleAdminOpen = useCallback(() => {
    if (isAdmin) {
      setView("admin");
    }
  }, [isAdmin]);

  const handleAdminClose = useCallback(() => {
    setView("home");
  }, []);

  const handleDenimCollection = useCallback(() => {
    handleCategorySelect("men" as Category);
  }, [handleCategorySelect]);

  const handleKnitwearCollection = useCallback(() => {
    handleCategorySelect("women" as Category);
  }, [handleCategorySelect]);

  // Full-page admin view
  if (view === "admin" && isAdmin) {
    return (
      <div
        className="min-h-screen bg-offwhite flex flex-col"
        data-ocid="app.section"
      >
        <Header
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          onCartOpen={() => setCartOpen(true)}
          onAccountOpen={() => setAccountOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onLogoClick={handleLogoClick}
          onAdminOpen={handleAdminOpen}
        />
        <main className="flex-1" data-ocid="main.section">
          <AdminPanel fullPage onClose={handleAdminClose} />
        </main>
        <FooterSection />

        <AccountPanel
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          onAdminOpen={handleAdminOpen}
          isAdmin={isAdmin ?? false}
        />
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onProductClick={handleProductClick}
        />
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleProductClose}
        />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-offwhite flex flex-col"
      data-ocid="app.section"
    >
      {/* Header */}
      <Header
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        onCartOpen={() => setCartOpen(true)}
        onAccountOpen={() => setAccountOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        onLogoClick={handleLogoClick}
        onAdminOpen={handleAdminOpen}
      />

      {/* Main content */}
      <main className="flex-1" data-ocid="main.section">
        {view === "home" ? (
          <>
            <HeroSection onShopNow={handleShopNow} />

            {/* Latest Arrivals */}
            <div className="bg-white">
              <ProductGrid
                category={null}
                onProductClick={handleProductClick}
                title="LATEST ARRIVALS"
              />
            </div>

            <FeaturedCollections
              onDenimClick={handleDenimCollection}
              onKnitwearClick={handleKnitwearCollection}
            />

            {/* Instagram strip */}
            <section className="w-full bg-white py-12 px-4">
              <div className="text-center mb-8">
                <h2 className="font-sans text-[14px] font-bold uppercase tracking-widest2 text-nearblack">
                  FOLLOW US @RKTRADE
                </h2>
                <div className="w-12 h-px bg-gold mx-auto mt-3" />
              </div>
              <div className="max-w-[1400px] mx-auto grid grid-cols-5 gap-2 md:gap-4">
                {INSTAGRAM_IMAGES.map(({ src, alt }) => (
                  <div
                    key={src}
                    className="aspect-square overflow-hidden bg-[#F7F6F2] group cursor-pointer"
                  >
                    <img
                      src={src}
                      alt={alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white min-h-[60vh]">
            <ProductGrid
              category={selectedCategory}
              onProductClick={handleProductClick}
            />
          </div>
        )}
      </main>

      <FooterSection />

      {/* Overlays */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onLoginRequest={handleLoginRequest}
      />

      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onAdminOpen={handleAdminOpen}
        isAdmin={isAdmin ?? false}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onProductClick={handleProductClick}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={handleProductClose}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
