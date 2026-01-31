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

  // Check if we are on the landing page
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "am" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { label: t("services"), href: "#services" },
    { label: t("pricing"), href: "/prices" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <header
      className={clsx(
        "left-0 right-0 z-50 transition-all duration-300",
        isLandingPage
          ? `fixed top-0 ${isScrolled ? "bg-white/95 md:bg-white/90 md:backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`
          : "relative bg-white shadow-sm py-4",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            {t("logo")}
          </span>
        </Link>

        {/* Desktop Nav - Only for Landing Page */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isExternal = link.href.startsWith("/");
              return isExternal ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-charcoal hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-charcoal hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLocale}
            title={t("switchLanguageAria")}
            aria-label={t("switchLanguageAria")}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-primary transition-colors"
          >
            <Globe className="w-4 h-4" />
            {t("otherLanguageName")}
          </button>

          {/* Show CTA on landing page, generic Contact/Telegram on inner pages if requested, but user asked for Telegram Contact btn */}
          {/* For now keeping the logic simple: CTA button on landing, maybe a Contact button on inner? 
               User said: "logo to switch languge and telegram contact btn" for inner pages. 
               Let's interpret "telegram contact btn" as a button linking to telegram or just the contact info.
               Since I don't have a specific Telegram link, I'll use a placeholder or the global contact link for now.
           */}
          {isLandingPage ? (
            <Button
              asChild
              className="hidden md:flex bg-primary hover:bg-primary-hover text-white rounded-full px-6"
            >
              <Link href="/resumes/templates">{t("cta")}</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 gap-2"
            >
              <a
                href="https://t.me/elutesh123"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                </svg>
                <span>{t("telegramContact")}</span>
              </a>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button - Only show on Landing Page? Or maybe restricted menu on inner pages? 
            User said "header... should not be sticky on other pages". 
            Let's keep mobile menu simple or hide navigation links on inner pages mobile menu too.
        */}
        {isLandingPage && (
          <button
            className="md:hidden p-2 text-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        )}
      </div>

      {/* Mobile Menu - Only for landing page navigation */}
      <AnimatePresence>
        {isLandingPage && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden p-4 border-t"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("/");
                return isExternal ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-charcoal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-charcoal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}
              <hr />
              <button
                onClick={() => {
                  toggleLocale();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-lg font-medium text-charcoal"
              >
                <Globe className="w-5 h-5" />
                {t("switchLanguage")}
              </button>
              <Link href="/form/cv?template=golden" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-white">
                  {t("cta")}
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
