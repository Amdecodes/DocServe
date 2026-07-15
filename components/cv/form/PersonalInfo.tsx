"use client";

import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCV } from "@/components/cv/CVContext";
import React, { useState, useEffect } from "react";

export function PersonalInfo() {
  const { cvData, updateCVData } = useCV();
  const [localData, setLocalData] = useState(cvData.personalInfo);

  // Sync with externals updates
  useEffect(() => {
    setLocalData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only update context on blur to prevent preview flickering
    updateCVData("personalInfo", { ...localData, [name]: value });
  };

  type PersonalInfo = typeof cvData.personalInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={localData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. John"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={localData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Doe"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="jobTitle" className="text-sm font-medium">
            Job Title{" "}
            <span className="text-gray-400 font-normal text-xs">
              (Optional)
            </span>
          </label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={localData.jobTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="headline" className="text-sm font-medium">
            Resume Headline
          </label>
          <Input
            id="headline"
            name="headline"
            value={localData.headline || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Senior Software Engineer specializing in React and Node.js"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={localData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={localData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+251 911 234 567"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            name="city"
            value={localData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Addis Ababa"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country"
            name="country"
            value={localData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ethiopia"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium">
            LinkedIn URL
          </label>
          <Input
            id="linkedin"
            name="linkedin"
            value={localData.linkedin || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Portfolio / Website
          </label>
          <Input
            id="website"
            name="website"
            value={localData.website || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="johndoe.com"
          />
        </div>
      </CardContent>
    </Card>
  );
}
