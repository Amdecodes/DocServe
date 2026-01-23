"use client";

import { useState } from "react";
import { useCV, EducationItem } from "@/components/cv/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function Step2_Education() {
  const { cvData, addItem, removeItem, updateItem } = useCV();
  const t = useTranslations("Education");

  // Local state for the new item form
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<EducationItem>>({});

  const handleAdd = () => {
    if (newItem.school && newItem.degree) {
      addItem("education", newItem);
      setNewItem({});
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewItem({});
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-500">{t("description")}</p>
      </div>

      {/* List of existing items */}
      <div className="space-y-4">
        {cvData.education.map((edu) => (
          <Card key={edu.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.school}</h3>
                  <p className="text-sm text-gray-600">{edu.degree}</p>
                  <p className="text-xs text-gray-400">
                    {edu.startDate} - {edu.endDate} | {edu.city}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem("education", edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Form */}
      {isAdding ? (
        <Card className="border-primary/50 ring-1 ring-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{t("add")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("school")}</label>
                <Input
                  value={newItem.school || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, school: e.target.value })
                  }
                  placeholder={t("placeholders.school")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("degree")}</label>
                <Input
                  value={newItem.degree || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, degree: e.target.value })
                  }
                  placeholder={t("placeholders.degree")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("startDate")}</label>
                <Input
                  type="date"
                  value={newItem.startDate || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startDate: e.target.value })
                  }
                  placeholder="Select date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("endDate")}</label>
                <Input
                  type="date"
                  value={newItem.endDate || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, endDate: e.target.value })
                  }
                  placeholder="Select date"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{t("city")}</label>
                <Input
                  value={newItem.city || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, city: e.target.value })
                  }
                  placeholder={t("placeholders.city")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button onClick={handleAdd}>{t("save")}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed py-8"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      )}
    </div>
  );
}
