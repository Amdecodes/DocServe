"use client"

import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { useCV } from "@/components/cv/CVContext"

export function Summary() {
  const { cvData, updateCVData } = useCV()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCVData("summary", e.target.value) 
  }

  const value = typeof cvData.summary === 'string' ? cvData.summary : (cvData.summary as any)?.text || ""

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
            value={value} 
            onChange={handleChange} 
            placeholder="e.g. Experienced software engineer with 5 years of experience in building scalable web applications..." 
            className="min-h-[150px]"
        />
      </CardContent>
    </Card>
  )
}
