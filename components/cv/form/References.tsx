"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { ReferenceItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function References() {
  const { cvData, updateCVData } = useCV();
  const t = useTranslations("References");
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ReferenceItem>>({});

  const handleAdd = () => {
    if (newItem.name) {
      const item = { ...newItem, id: Date.now().toString() } as ReferenceItem;
      updateCVData("references", [...(cvData.references || []), item]);
      setNewItem({});
      setIsAdding(false);
    }
  };

  const remove = (id: string) => {
    updateCVData(
      "references",
      (cvData.references || []).filter((r) => r.id !== id),
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <p className="text-sm text-gray-500">
          {t("description")}
        </p>
      </div>

      {/* References Upon Request Checkbox */}
      <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <input
          type="checkbox"
          id="referencesUponRequest"
          checked={cvData.referencesUponRequest || false}
          disabled={(cvData.references || []).length > 0}
          onChange={(e) => {
            updateCVData("referencesUponRequest", e.target.checked);
            if (e.target.checked) {
              updateCVData("references", []);
              setIsAdding(false);
            }
          }}
          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
        <label htmlFor="referencesUponRequest" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          {t("uponRequest")}
        </label>
      </div>

      <div className="space-y-4">
        {cvData.references?.map((ref) => (
          <Card key={ref.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{ref.name}</h3>
                  <p className="text-sm font-medium text-teal-600">
                    {ref.position} {ref.company ? `at ${ref.company}` : ""}
                  </p>
                  <div className="text-xs text-gray-500 mt-1 flex gap-4">
                    {ref.phone && <span>{ref.phone}</span>}
                    {ref.email && <span>{ref.email}</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => remove(ref.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!cvData.referencesUponRequest && isAdding ? (
        <Card className="border-primary/50 ring-1 ring-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{t("add")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("name")}</label>
                <Input
                  value={newItem.name || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder={t("placeholders.name")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("position")}</label>
                <Input
                  value={newItem.position || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, position: e.target.value })
                  }
                  placeholder={t("placeholders.position")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("company")}</label>
                <Input
                  value={newItem.company || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, company: e.target.value })
                  }
                  placeholder={t("placeholders.company")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("phone")}</label>
                <Input
                  value={newItem.phone || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, phone: e.target.value })
                  }
                  placeholder={t("placeholders.phone")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{t("email")}</label>
                <Input
                  value={newItem.email || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, email: e.target.value })
                  }
                  placeholder={t("placeholders.email")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleAdd}>{t("save")}</Button>
            </div>
          </CardContent>
        </Card>
      ) : !cvData.referencesUponRequest ? (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed py-8"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      ) : null}
    </div>
  );
}
