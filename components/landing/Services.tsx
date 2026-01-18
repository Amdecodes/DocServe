"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { FileText, Printer, Megaphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const t = useTranslations("Services");

  const categories = [
    {
      id: "digital",
      title: t("digital.title"),
      icon: FileText,
      items: [
        { label: t("digital.cv") },
        { label: t("digital.agreement") },
        { label: t("digital.editing") },
      ],
      action: t("digital.action"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "printing",
      title: t("printing.title"),
      icon: Printer,
      items: [
        { label: t("printing.invitations") },
        { label: t("printing.certificates") },
        { label: t("printing.menus") },
        { label: t("printing.academic") },
      ],
      action: t("printing.action"),
      color: "bg-teal-50 text-teal-600",
    },
    {
      id: "promotional",
      title: t("promotional.title"),
      icon: Megaphone,
      items: [
        { label: t("promotional.banners") },
        { label: t("promotional.tshirts") },
        { label: t("promotional.mugs") },
        { label: t("promotional.stickers") },
      ],
      action: t("promotional.action"),
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="services" className="py-20 bg-lightbg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t("title")}</h2>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-6`}>
                <category.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-charcoal mb-6">{category.title}</h3>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                    {item.label}
                  </li>
                ))}
              </ul>
              
              <Link href={category.id === 'digital' ? '/services/cv/templates' : '/contact'} className="w-full">
                <Button variant="outline" className="w-full justify-between group">
                  {category.action}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
