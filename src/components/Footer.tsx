import { MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-obsidian-light border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl tracking-[0.3em] text-gold font-light uppercase mb-4">
          Lakshya
        </h2>
        <p className="font-display text-sm text-muted-foreground italic tracking-wider mb-6">
          Sacred. Rare. Eternal.
        </p>
        <p className="text-xs text-muted-foreground tracking-wider font-sans mb-8">
          Chennai, India
        </p>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gold hover:text-foreground transition-colors duration-300 text-xs tracking-[0.2em] uppercase font-sans"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <div className="divider-gold mt-10 mb-6" />
        <p className="text-xs text-muted-foreground/50 font-sans">
          © {new Date().getFullYear()} Lakshya. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
