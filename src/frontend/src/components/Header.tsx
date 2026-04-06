import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Category } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCart } from "../hooks/useQueries";

interface HeaderProps {
  onCategorySelect: (cat: Category | null) => void;
  selectedCategory: Category | null;
  onCartOpen: () => void;
  onAccountOpen: () => void;
  onSearchOpen: () => void;
  onLogoClick: () => void;
}

const NAV_LINKS: { label: string; value: Category | null }[] = [
  { label: "MEN", value: "men" as Category },
  { label: "WOMEN", value: "women" as Category },
  { label: "KIDS", value: "kids" as Category },
  { label: "NEW ARRIVALS", value: "newArrivals" as Category },
  { label: "SALE", value: "sale" as Category },
];

export default function Header({
  onCategorySelect,
  selectedCategory,
  onCartOpen,
  onAccountOpen,
  onSearchOpen,
  onLogoClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cart } = useCart();
  const { identity } = useInternetIdentity();

  const cartCount =
    cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-header"
      data-ocid="header.section"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: mobile hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 text-nearblack hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="header.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-1 select-none"
            data-ocid="header.link"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-nearblack leading-none">
              RK
            </span>
            <span className="font-sans text-xs font-semibold tracking-widest2 text-gold uppercase mt-1 ml-0.5">
              TRADE
            </span>
          </button>
        </div>

        {/* Center: desktop nav */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => onCategorySelect(link.value)}
              className={`font-sans text-[12px] font-medium tracking-widest uppercase transition-colors ${
                selectedCategory === link.value
                  ? "text-gold border-b border-gold pb-0.5"
                  : "text-[#3A3A3A] hover:text-gold"
              }`}
              data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: utility icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSearchOpen}
            className="p-2 text-[#3A3A3A] hover:text-gold transition-colors"
            aria-label="Search"
            data-ocid="header.search_input"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onAccountOpen}
            className="p-2 text-[#3A3A3A] hover:text-gold transition-colors relative"
            aria-label="Account"
            data-ocid="header.account.button"
          >
            <User className="w-5 h-5" />
            {identity && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
          <button
            type="button"
            className="p-2 text-[#3A3A3A] hover:text-gold transition-colors"
            aria-label="Wishlist"
            data-ocid="header.wishlist.button"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onCartOpen}
            className="p-2 text-[#3A3A3A] hover:text-gold transition-colors relative"
            aria-label={`Cart (${cartCount})`}
            data-ocid="header.cart.button"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0 -right-0 min-w-[18px] h-[18px] rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E5E5E5] z-40 shadow-lg"
            data-ocid="header.mobile.panel"
          >
            <nav className="flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    onCategorySelect(link.value);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-6 py-3 text-left font-sans text-[12px] font-medium tracking-widest uppercase transition-colors ${
                    selectedCategory === link.value
                      ? "text-gold bg-[#F7F6F2]"
                      : "text-[#3A3A3A] hover:text-gold hover:bg-[#F7F6F2]"
                  }`}
                  data-ocid={`mobile_nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
