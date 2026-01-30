"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-charcoal text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} SENEDX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
