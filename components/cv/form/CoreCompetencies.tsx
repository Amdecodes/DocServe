"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { X, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

export function CoreCompetencies() {
  const { cvData, updateCVData } = useCV();
  const t = useTranslations("CoreCompetencies");
  const [newValue, setNewValue] = useState("");

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newValue.trim()) {
      const current = cvData.coreCompetencies || [];
      updateCVData("coreCompetencies", [...current, newValue.trim()]);
      setNewValue("");
    }
  };

  const handleRemove = (index: number) => {
    const current = cvData.coreCompetencies || [];
    const newArray = [...current];
    newArray.splice(index, 1);
    updateCVData("coreCompetencies", newArray);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cvData.coreCompetencies?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 border rounded-md group"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
              <span className="flex-1 text-sm">{item}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-6 w-6 text-gray-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> {t("add")}
          </Button>
        </form>
        <div className="text-xs text-gray-500 text-right">
          {cvData.coreCompetencies?.length || 0} {t("items")}
        </div>
      </CardContent>
    </Card>
  );
}
