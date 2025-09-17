"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, Download, Sparkles, Target } from "lucide-react"
import { ResumePreview } from "@/components/resume-preview"
import { ATSAnalysis } from "@/components/ats-analysis"
import { TemplateSelector } from "@/components/template-selector"

interface GeneratedContent {
  summary: string
  bullets: string[]
  keywords: string[]
}

export default function ResumeGenerator() {
  const [inputText, setInputText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("classic")
  const [isExporting, setIsExporting] = useState(false)

  const handleGenerate = async () => {
    if (!inputText.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: inputText,
          jobDescription: jobDescription,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate content")

      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = async () => {
    if (!generatedContent) return

    setIsExporting(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          template: selectedTemplate,
        }),
      })

      if (!response.ok) throw new Error("Failed to export PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "resume.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">AI-Powered Resume Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform your experience into a professional resume with AI-generated content, ATS optimization, and
            one-click PDF export.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Experience
                </CardTitle>
                <CardDescription>Paste your raw experience, job descriptions, or bullet points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your experience here... 

Example:
• Managed team of 5 developers
• Increased sales by 30%
• Led project that saved company $100k
• Built React applications with 99% uptime"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Job Description (Optional)</label>
                  <Textarea
                    placeholder="Paste the job description you're applying for to optimize ATS keywords..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!inputText.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Resume Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Selection</CardTitle>
                <CardDescription>Choose your preferred resume template</CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
              </CardContent>
            </Card>

            {/* ATS Analysis */}
            {generatedContent && jobDescription && (
              <ATSAnalysis content={generatedContent} jobDescription={jobDescription} />
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {generatedContent ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Generated Resume</h2>
                  <Button onClick={handleExportPDF} disabled={isExporting} variant="outline">
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </>
                    )}
                  </Button>
                </div>

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="content">Raw Content</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <ResumePreview content={generatedContent} template={selectedTemplate} />
                  </TabsContent>

                  <TabsContent value="content" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Professional Summary</h3>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {generatedContent.summary}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Optimized Bullet Points</h3>
                          <ul className="space-y-2">
                            {generatedContent.bullets.map((bullet, index) => (
                              <li key={index} className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                • {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Key Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Ready to Generate</h3>
                    <p className="text-muted-foreground">
                      Add your experience and click generate to see your AI-optimized resume
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
