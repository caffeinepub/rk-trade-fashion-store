import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function FooterSection() {
  const currentYear = new Date().getFullYear();
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return (
    <footer className="footer-dark mt-16" data-ocid="footer.section">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-display text-2xl font-bold text-white">
                RK
              </span>
              <span className="font-sans text-xs font-semibold tracking-widest2 text-gold uppercase mt-1 ml-0.5">
                TRADE
              </span>
            </div>
            <p className="font-sans text-sm text-[#BDBDBD] leading-relaxed">
              Elevate your wardrobe with curated fashion. Quality pieces for
              every occasion.
            </p>
            <div className="mt-4">
              <p className="font-sans text-xs text-[#BDBDBD] leading-relaxed">
                Follow us <span className="text-gold">@RKTRADE</span>
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {["Men", "Women", "Kids", "New Arrivals", "Sale"].map((item) => (
                <li key={item}>
                  <span className="font-sans text-sm text-[#BDBDBD] hover:text-white cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-white mb-4">
              Help
            </h4>
            <ul className="space-y-2">
              {[
                "Size Guide",
                "Shipping Info",
                "Returns & Exchanges",
                "Track Order",
                "Contact Us",
              ].map((item) => (
                <li key={item}>
                  <span className="font-sans text-sm text-[#BDBDBD] hover:text-white cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-white mb-4">
              Newsletter
            </h4>
            <p className="font-sans text-sm text-[#BDBDBD] mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 text-white placeholder-[#BDBDBD] font-sans text-sm outline-none focus:border-gold transition-colors"
                data-ocid="newsletter.input"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gold text-white font-sans text-[11px] font-semibold uppercase tracking-wider hover:bg-[#9A7F45] transition-colors"
                data-ocid="newsletter.submit_button"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <p className="font-sans text-xs text-white font-semibold">
            &copy; {currentYear} <span className="text-gold">RK Trade</span>.
            All rights reserved.
          </p>

          {/* Center: caffeine attribution */}
          <p className="font-sans text-xs text-[#BDBDBD]">
            Built with &hearts; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>

          {/* Right: payment icons + install button */}
          <div className="flex items-center gap-4">
            {["Visa", "Mastercard", "PayPal", "Amex"].map((card) => (
              <span
                key={card}
                className="font-sans text-[10px] font-semibold text-[#BDBDBD] border border-white/10 px-2 py-0.5"
              >
                {card}
              </span>
            ))}

            {installPrompt && !installed && (
              <button
                type="button"
                onClick={handleInstall}
                data-ocid="footer.install_button"
                className="flex items-center gap-1.5 px-3 py-1 border border-gold text-gold font-sans text-[11px] font-semibold uppercase tracking-wider hover:bg-gold hover:text-white transition-colors"
              >
                <Download size={12} />
                Install App
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
