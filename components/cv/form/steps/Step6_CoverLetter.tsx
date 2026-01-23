"use client";

import React from "react";
import { useCV } from "@/components/cv/CVContext";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

export const Step6_CoverLetter = () => {
  const { cvData, updateCoverLetter } = useCV();
  const coverLetter = cvData.coverLetter;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    updateCoverLetter({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cover Letter</h2>
        <p className="text-gray-600 mt-1">
          Add a professional cover letter to accompany your resume.
        </p>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recipient Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Recipient Name
              </label>
              <Input
                name="recipientName"
                placeholder="e.g. Hiring Manager"
                value={coverLetter?.recipientName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                name="companyName"
                placeholder="e.g. Acme Corp"
                value={coverLetter?.companyName || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Job Title You&apos;re Applying For
            </label>
            <Input
              name="jobTitle"
              placeholder="e.g. Senior Developer"
              value={coverLetter?.jobTitle || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Letter Content
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tone</label>
            <Select
              name="tone"
              value={coverLetter?.tone || "Neutral"}
              onChange={handleChange}
            >
              <option value="Formal">Formal</option>
              <option value="Neutral">Neutral</option>
              <option value="Confident">Confident</option>
            </Select>
            <p className="text-xs text-gray-500">
              Choose the tone that best matches your target company culture.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Letter Body
            </label>
            <Textarea
              name="letterBody"
              placeholder="Write your cover letter here. Explain why you're a great fit for this role and what value you can bring to the company..."
              value={coverLetter?.letterBody || ""}
              onChange={handleChange}
              className="min-h-75"
            />
            <p className="text-xs text-gray-500">
              Tip: Your name and contact info will be pulled from your resume
              header automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
