"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const templates = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Traditional format with clean lines and serif typography",
    preview: {
      headerStyle: "border-b border-border",
      sectionStyle: "border-b border-border pb-1",
      fontFamily: "font-serif",
      accentColor: "text-foreground",
    },
  },
  {
    id: "modern",
    name: "Modern Clean",
    description: "Contemporary design with emerald accents and sans-serif fonts",
    preview: {
      headerStyle: "border-b-2 border-primary",
      sectionStyle: "text-primary border-l-4 border-primary pl-3",
      fontFamily: "font-sans",
      accentColor: "text-primary",
    },
  },
]

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTemplate === template.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onTemplateChange(template.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Template Preview */}
            <div className={`space-y-3 text-xs ${template.preview.fontFamily} bg-card p-3 rounded border`}>
              {/* Header Preview */}
              <div className={`text-center pb-2 ${template.preview.headerStyle}`}>
                <div className="font-bold text-foreground">John Doe</div>
                <div className="text-muted-foreground text-[10px]">john@example.com</div>
              </div>

              {/* Section Preview */}
              <div>
                <h4 className={`font-semibold mb-1 text-[11px] ${template.preview.sectionStyle}`}>
                  Professional Summary
                </h4>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  Experienced professional with proven track record...
                </div>
              </div>

              {/* Skills Preview */}
              <div>
                <h4 className={`font-semibold mb-1 text-[11px] ${template.preview.sectionStyle}`}>Skills</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[8px] px-1 py-0">
                    React
                  </Badge>
                  <Badge variant="secondary" className="text-[8px] px-1 py-0">
                    TypeScript
                  </Badge>
                  <Badge variant="secondary" className="text-[8px] px-1 py-0">
                    Node.js
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
