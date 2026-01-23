"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { VolunteerItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash2 } from "lucide-react";

export function Volunteer() {
  const { cvData, updateCVData } = useCV();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<VolunteerItem>>({});

  const handleAdd = () => {
    if (newItem.organization && newItem.role) {
      const item = { ...newItem, id: Date.now().toString() } as VolunteerItem;
      updateCVData("volunteer", [...(cvData.volunteer || []), item]);
      setNewItem({});
      setIsAdding(false);
    }
  };

  const remove = (id: string) => {
    updateCVData(
      "volunteer",
      (cvData.volunteer || []).filter((v) => v.id !== id),
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Volunteer & Community</h2>
        <p className="text-sm text-gray-500">
          Share your impact outside of work.
        </p>
      </div>

      <div className="space-y-4">
        {cvData.volunteer?.map((vol) => (
          <Card key={vol.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{vol.role}</h3>
                  <p className="text-sm font-medium text-teal-600">
                    {vol.organization}
                  </p>
                  {vol.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {vol.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => remove(vol.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Volunteer Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization</label>
              <Input
                value={newItem.organization || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, organization: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input
                value={newItem.role || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, role: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Impact Description</label>
              <Textarea
                value={newItem.description || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Volunteer Work
        </Button>
      )}
    </div>
  );
}
