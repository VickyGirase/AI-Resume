import { Card, CardContent } from "@/components/ui/card"

interface GeneratedContent {
  summary: string
  bullets: string[]
  keywords: string[]
}

interface ResumePreviewProps {
  content: GeneratedContent
  template: string
}

export function ResumePreview({ content, template }: ResumePreviewProps) {
  const isModern = template === "modern"

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className={`space-y-6 ${isModern ? "font-sans" : "font-serif"}`}>
          {/* Header */}
          <div className={`text-center pb-4 ${isModern ? "border-b-2 border-primary" : "border-b border-border"}`}>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Name</h1>
            <p className="text-muted-foreground">your.email@example.com | (555) 123-4567 | LinkedIn Profile</p>
          </div>

          {/* Professional Summary */}
          <div>
            <h2
              className={`text-lg font-semibold text-foreground mb-3 ${
                isModern ? "text-primary border-l-4 border-primary pl-3" : "border-b border-border pb-1"
              }`}
            >
              Professional Summary
            </h2>
            <p className="text-sm text-foreground leading-relaxed">{content.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h2
              className={`text-lg font-semibold text-foreground mb-3 ${
                isModern ? "text-primary border-l-4 border-primary pl-3" : "border-b border-border pb-1"
              }`}
            >
              Professional Experience
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">Your Job Title</h3>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2020 - Present</span>
                </div>

                <ul className="space-y-1 ml-4">
                  {content.bullets.map((bullet, index) => (
                    <li key={index} className="text-sm text-foreground list-disc">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2
              className={`text-lg font-semibold text-foreground mb-3 ${
                isModern ? "text-primary border-l-4 border-primary pl-3" : "border-b border-border pb-1"
              }`}
            >
              Key Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${
                    isModern ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2
              className={`text-lg font-semibold text-foreground mb-3 ${
                isModern ? "text-primary border-l-4 border-primary pl-3" : "border-b border-border pb-1"
              }`}
            >
              Education
            </h2>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">Your Degree</h3>
                <p className="text-sm text-muted-foreground">University Name</p>
              </div>
              <span className="text-sm text-muted-foreground">Graduation Year</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
