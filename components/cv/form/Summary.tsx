"use client";

import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useCV } from "@/components/cv/CVContext";
import React, { useState, useEffect } from "react";

export function Summary() {
  const { cvData, updateCVData } = useCV();
  const [localSummary, setLocalSummary] = useState(cvData.summary || "");

  useEffect(() => {
    setLocalSummary(cvData.summary || "");
  }, [cvData.summary]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSummary(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    updateCVData("summary", e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          Write 2-4 sentences that highlight your value and years of experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={localSummary}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Experienced software engineer with 5 years of experience in building scalable web applications..."
          className="min-h-37.5"
        />
        <div className="text-xs text-muted-foreground text-right mt-2">
          {localSummary.length} characters
        </div>
      </CardContent>
    </Card>
  );
}
