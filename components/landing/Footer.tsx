"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer id="contact" className="bg-charcoal text-white pt-20 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white mb-6 block">
              DocuServe
            </Link>
            <p className="text-gray-400 mb-6">
              {t("brandDesc")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("quickLinks")}</h3>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors">{t("services")}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">{t("contact")}</Link></li>
              <li><Link href="/process" className="text-gray-400 hover:text-primary transition-colors">{t("howItWorks")}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("services")}</h3>
            <ul className="space-y-4">
              <li><Link href="/services#digital" className="text-gray-400 hover:text-primary transition-colors">{t("digitalDocs")}</Link></li>
              <li><Link href="/services#printing" className="text-gray-400 hover:text-primary transition-colors">{t("printing")}</Link></li>
              <li><Link href="/services#branding" className="text-gray-400 hover:text-primary transition-colors">{t("branding")}</Link></li>
              <li><Link href="/prices" className="text-gray-400 hover:text-primary transition-colors">{t("pricing")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("contact")}</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t("addressLine1")}<br/>{t("addressLine2")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DocuServe. {t("rightsReserved")}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">{t("terms")}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{t("privacyPolicy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
