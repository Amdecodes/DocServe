"use client";

import Link from "next/link";
import { AGREEMENT_TEMPLATES } from "@/config/agreements";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { FileText, ChevronRight } from "lucide-react";

export default function AgreementsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Agreements & Contracts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional, legally binding agreements in minutes. Select a
            template, fill in the details, and download your PDF instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AGREEMENT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <FileText className="w-8 h-8 text-teal-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {template.category}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.title}
                </h3>

                <p className="text-gray-600 mb-6 flex-1">
                  {template.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-teal-700">
                    {template.price} ETB
                  </span>

                  <Link
                    href={`/form/agreement/${template.id}`}
                    className="w-full ml-4"
                  >
                    <Button className="w-full bg-gray-900 hover:bg-black text-white">
                      create
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
