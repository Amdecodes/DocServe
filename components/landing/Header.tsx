"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button"; // Assuming UI components exist or I'll implement a basic one
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "am" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { label: t("services"), href: "#services" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("pricing"), href: "#pricing" }, // Optional
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          {t("logo")}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-charcoal hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-primary transition-colors"
          >
            <Globe className="w-4 h-4" />
            {locale === "en" ? "አማርኛ" : "English"}
          </button>
          
          <Button className="bg-primary hover:bg-primary-hover text-white rounded-full px-6">
            {t("cta")}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-charcoal"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden p-4 border-t"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-charcoal"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr />
              <button
                onClick={() => {
                  toggleLocale();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-lg font-medium text-charcoal"
              >
                <Globe className="w-5 h-5" />
                {locale === "en" ? "Change to Amharic" : "ወደ እንግሊዝኛ ቀይር"}
              </button>
              <Button className="w-full bg-primary text-white">
                {t("cta")}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
