import { useState, useEffect } from "react";
import { Home, Sparkles, Layers, Settings, Mail } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import NavHeader from "@/components/ui/nav-header";
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";

const navItems = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Collection", href: "#collection" },
  { label: "Process", href: "#process" },
  { label: "Inquire", href: "#contact" },
];

const mobileMenuItems: InteractiveMenuItem[] = [
  { label: "Home", icon: Home, href: "#hero" },
  { label: "Philosophy", icon: Sparkles, href: "#philosophy" },
  { label: "Collection", icon: Layers, href: "#collection" },
  { label: "Process", icon: Settings, href: "#process" },
  { label: "Inquire", icon: Mail, href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (href: string) => {
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="block group"
            aria-label="Lakshya - Go to homepage"
          >
            <img
              src="/logo.jpg"
              alt="Lakshya"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <NavHeader items={navItems} onNavigate={handleNavigate} />
          </div>

          {/* Cart */}
          <div className="flex items-center">
            <CartDrawer />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden safe-area-bottom">
        <InteractiveMenu
          items={mobileMenuItems}
          accentColor="hsl(var(--gold))"
          onNavigate={handleNavigate}
        />
      </div>
    </>
  );
};

export default Navbar;
