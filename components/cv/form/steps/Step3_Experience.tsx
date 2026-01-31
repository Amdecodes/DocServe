"use client";

import { useState } from "react";
import { useCV, ExperienceItem } from "@/components/cv/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function Step3_Experience() {
  const { cvData, addItem, removeItem } = useCV();
  const t = useTranslations("Experience");

  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ExperienceItem>>({
    achievements: [],
  });
  const [curAchievement, setCurAchievement] = useState("");

  const handleAdd = () => {
    if (newItem.company && newItem.jobTitle) {
      addItem("experience", {
        ...newItem,
        description: newItem.description || "",
        achievements: newItem.achievements || [],
      });
      setNewItem({ achievements: [] });
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewItem({ achievements: [] });
    setIsAdding(false);
  };

  const addAchievement = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (curAchievement.trim()) {
      setNewItem((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), curAchievement.trim()],
      }));
      setCurAchievement("");
    }
  };

  const removeAchievement = (idx: number) => {
    setNewItem((prev) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== idx),
    }));
  };

  const toggleCurrent = (checked: boolean) => {
    setNewItem((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-500">{t("description")}</p>
      </div>

      <div className="space-y-4">
        {cvData.experience.map((exp) => (
          <Card key={exp.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{exp.jobTitle}</h3>
                  <p className="text-sm font-medium text-teal-600">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-400">
                    {exp.startDate} - {exp.current ? t("present") : exp.endDate}
                  </p>
                  {/* Achievments */}
                  {exp.achievements && exp.achievements.length > 0 ? (
                    <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  ) : (
                    // Fallback for legacy
                    exp.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {exp.description}
                      </p>
                    )
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem("experience", exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding ? (
        <Card className="border-primary/50 ring-1 ring-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{t("add")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("jobTitle")}</label>
                <Input
                  value={newItem.jobTitle || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, jobTitle: e.target.value })
                  }
                  placeholder={t("placeholders.jobTitle")}
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
                <div className="flex gap-2 items-center">
                  {!newItem.current && (
                    <Input
                      type="date"
                      value={newItem.endDate || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, endDate: e.target.value })
                      }
                    />
                  )}
                  <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newItem.current || false}
                      onChange={(e) => toggleCurrent(e.target.checked)}
                      className="h-4 w-4 accent-black"
                    />
                    Current
                  </label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Key Achievements (Bullet Points)
                </label>
                <div className="space-y-2 mb-2">
                  {newItem.achievements?.map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center text-sm bg-gray-50 p-2 rounded"
                    >
                      <div className="h-1.5 w-1.5 bg-black rounded-full shrink-0 ml-1" />
                      <span className="flex-1">{ach}</span>
                      <button
                        onClick={() => removeAchievement(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={curAchievement}
                    onChange={(e) => setCurAchievement(e.target.value)}
                    placeholder="e.g. Led a team of 5 developers..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAchievement(e);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => addAchievement(e)}
                  >
                    Add
                  </Button>
                </div>
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
