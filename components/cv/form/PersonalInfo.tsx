"use client"

import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label" // Need to create Label if not exists, or just use plain label
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useCV } from "@/components/cv/CVContext"
import { useTranslations } from "next-intl"

export function PersonalInfo() {
  const { cvData, updateCVData } = useCV()
  // const t = useTranslations("PersonalInfo") // TODO: Add translations

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateCVData("personalInfo", { [name]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
          <Input id="firstName" name="firstName" value={cvData.personalInfo.firstName} onChange={handleChange} placeholder="e.g. John" />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
          <Input id="lastName" name="lastName" value={cvData.personalInfo.lastName} onChange={handleChange} placeholder="e.g. Doe" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
           <Input id="jobTitle" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" name="email" type="email" value={cvData.personalInfo.email} onChange={handleChange} placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <Input id="phone" name="phone" type="tel" value={cvData.personalInfo.phone} onChange={handleChange} placeholder="+251 911 234 567" />
        </div>
        <div className="space-y-2">
           <label htmlFor="city" className="text-sm font-medium">City</label>
           <Input id="city" name="city" value={cvData.personalInfo.city} onChange={handleChange} placeholder="Addis Ababa" />
        </div>
         <div className="space-y-2">
           <label htmlFor="country" className="text-sm font-medium">Country</label>
           <Input id="country" name="country" value={cvData.personalInfo.country} onChange={handleChange} placeholder="Ethiopia" />
        </div>
      </CardContent>
    </Card>
  )
}
