"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Image from "next/image";

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
    { label: t("services"), href: "/services" },
    { label: t("about"), href: "/about" },
    { label: t("pricing"), href: "/prices" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <div className={clsx(isLandingPage && "relative w-full")}>
      <header
        className={clsx(
          "z-50 transition-all duration-500 ease-in-out",
          isLandingPage
            ? isScrolled
              ? "fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl rounded-full bg-white/75 border border-white/30 shadow-[0_8px_32px_0_rgba(0,137,123,0.08)] backdrop-blur-xl py-2 px-6"
              : "fixed top-0 left-0 right-0 bg-transparent py-6 px-4"
            : "relative bg-white border-b border-gray-100 py-4 px-4",
        )}
      >
        {/* Apple liquid glow glass backdrop effect */}
        {isLandingPage && isScrolled && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 blur-md -z-10 animate-pulse pointer-events-none" />
        )}

        <div className="container mx-auto flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className={clsx(
                "relative transition-all duration-300",
                isLandingPage && isScrolled ? "h-8 w-28 md:h-9 md:w-36" : "h-9 w-36 md:h-12 md:w-48"
              )}
            >
              <Image
                src="/images/Logo/senedx logo.svg"
                alt={t("logo")}
                fill
                className="object-contain scale-110"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav - Only for Landing Page */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("/");
                return isExternal ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-charcoal hover:text-primary transition-all duration-300 font-semibold text-sm tracking-tight relative py-1.5 px-3 rounded-full hover:bg-primary/5 active:scale-95"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-charcoal hover:text-primary transition-all duration-300 font-semibold text-sm tracking-tight relative py-1.5 px-3 rounded-full hover:bg-primary/5 active:scale-95"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleLocale}
              title={t("switchLanguageAria")}
              aria-label={t("switchLanguageAria")}
              className="flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-primary transition-all duration-300 py-1.5 px-3 rounded-full hover:bg-primary/5 active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              {t("otherLanguageName")}
            </button>

            {isLandingPage ? (
              <Button
                asChild
                className={clsx(
                  "hidden md:flex bg-primary hover:bg-primary-hover text-white rounded-full px-6 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md active:scale-95",
                  isScrolled ? "h-9 text-xs" : "h-10 text-sm"
                )}
              >
                <Link href="/resumes/templates">{t("cta")}</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md active:scale-95 h-10 text-sm"
              >
                <a
                  href="https://t.me/senedx"
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
                  <span>@senedx</span>
                </a>
              </Button>
            )}

            {isLandingPage && (
              <button
                className="md:hidden p-2 text-charcoal rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only for landing page navigation */}
        <AnimatePresence>
          {isLandingPage && isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={clsx(
                "absolute left-0 right-0 p-6 flex flex-col gap-4 z-50 border shadow-2xl transition-all duration-300",
                isScrolled
                  ? "top-full mt-2 bg-white/90 backdrop-blur-xl border-white/30 rounded-3xl"
                  : "top-full bg-white border-gray-100 rounded-b-2xl"
              )}
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isExternal = link.href.startsWith("/");
                  return isExternal ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-bold text-charcoal hover:text-primary transition-colors py-1 px-2 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-bold text-charcoal hover:text-primary transition-colors py-1 px-2 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <hr className="border-gray-100" />
                <button
                  onClick={() => {
                    toggleLocale();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-bold text-charcoal hover:text-primary transition-colors py-1 px-2 rounded-lg text-left"
                >
                  <Globe className="w-5 h-5" />
                  {t("switchLanguage")}
                </button>
                <Link
                  href="/form/cv?template=golden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-5 font-bold shadow-md">
                    {t("cta")}
                  </Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
