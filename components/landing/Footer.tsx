import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Send,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-charcoal text-white py-12 border-t border-gray-800"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
              <a href="mailto:senedxservice@gmail.com">
                senedxservice@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <a href="tel:+251900336928">0900336928</a>
            </div>
          </div>
          <div className="flex gap-8">
            <a
              href="https://t.me/Sende_x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200"
            >
              <Send className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/senedx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/senedx_service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-200"
            >
              <Instagram className="w-6 h-6" />
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
