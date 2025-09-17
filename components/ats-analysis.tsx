import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Target, TrendingUp, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GeneratedContent {
  summary: string
  bullets: string[]
  keywords: string[]
}

interface ATSAnalysisProps {
  content: GeneratedContent
  jobDescription: string
}

function extractKeywords(text: string): { technical: string[]; soft: string[]; industry: string[] } {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)

  // Common technical keywords
  const technicalPatterns = [
    "react",
    "javascript",
    "typescript",
    "python",
    "java",
    "sql",
    "aws",
    "docker",
    "kubernetes",
    "node",
    "express",
    "mongodb",
    "postgresql",
    "git",
    "agile",
    "scrum",
    "api",
    "rest",
    "graphql",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "vue",
    "angular",
    "next",
    "nuxt",
    "firebase",
    "azure",
  ]

  // Soft skills keywords
  const softSkillPatterns = [
    "leadership",
    "management",
    "communication",
    "collaboration",
    "teamwork",
    "problem-solving",
    "analytical",
    "creative",
    "strategic",
    "organized",
    "detail-oriented",
    "adaptable",
  ]

  // Industry-specific terms
  const industryPatterns = [
    "marketing",
    "sales",
    "finance",
    "accounting",
    "healthcare",
    "education",
    "consulting",
    "engineering",
    "design",
    "product",
    "project",
    "business",
    "operations",
    "strategy",
  ]

  const technical = words.filter((word) => technicalPatterns.some((pattern) => word.includes(pattern)))
  const soft = words.filter((word) => softSkillPatterns.some((pattern) => word.includes(pattern)))
  const industry = words.filter((word) => industryPatterns.some((pattern) => word.includes(pattern)))

  return {
    technical: [...new Set(technical)].slice(0, 10),
    soft: [...new Set(soft)].slice(0, 8),
    industry: [...new Set(industry)].slice(0, 8),
  }
}

export function ATSAnalysis({ content, jobDescription }: ATSAnalysisProps) {
  const resumeText = (content.summary + " " + content.bullets.join(" ")).toLowerCase()
  const jobKeywords = extractKeywords(jobDescription)
  const resumeKeywords = extractKeywords(resumeText)

  const calculateCategoryMatch = (jobCat: string[], resumeCat: string[]) => {
    if (jobCat.length === 0) return 100
    const matches = jobCat.filter((keyword) =>
      resumeCat.some((resumeKeyword) => resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword)),
    )
    return Math.round((matches.length / jobCat.length) * 100)
  }

  const technicalMatch = calculateCategoryMatch(jobKeywords.technical, resumeKeywords.technical)
  const softSkillsMatch = calculateCategoryMatch(jobKeywords.soft, resumeKeywords.soft)
  const industryMatch = calculateCategoryMatch(jobKeywords.industry, resumeKeywords.industry)

  const overallScore = Math.round((technicalMatch + softSkillsMatch + industryMatch) / 3)

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 50) return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <AlertCircle className="h-4 w-4 text-red-600" />
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-50 border-green-200"
    if (score >= 50) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          ATS Optimization Analysis
        </CardTitle>
        <CardDescription>Comprehensive analysis of how well your resume matches the job requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Overall Score */}
            <div className={`p-4 rounded-lg border ${getScoreBg(overallScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getScoreIcon(overallScore)}
                  <span className="font-semibold">Overall ATS Match Score</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
              </div>
              <Progress value={overallScore} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground">
                {overallScore >= 70 && "Excellent! Your resume is well-optimized for ATS systems."}
                {overallScore >= 50 && overallScore < 70 && "Good match. Consider adding more relevant keywords."}
                {overallScore < 50 && "Consider incorporating more keywords from the job description."}
              </p>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className={`text-xl font-bold ${getScoreColor(technicalMatch)}`}>{technicalMatch}%</div>
                <div className="text-sm text-muted-foreground">Technical Skills</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className={`text-xl font-bold ${getScoreColor(softSkillsMatch)}`}>{softSkillsMatch}%</div>
                <div className="text-sm text-muted-foreground">Soft Skills</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className={`text-xl font-bold ${getScoreColor(industryMatch)}`}>{industryMatch}%</div>
                <div className="text-sm text-muted-foreground">Industry Terms</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {/* Technical Keywords */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Technical Keywords ({technicalMatch}% match)
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Found in Resume:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resumeKeywords.technical.slice(0, 8).map((keyword, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Missing from Job Description:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobKeywords.technical
                      .filter((k) => !resumeKeywords.technical.some((r) => r.includes(k) || k.includes(r)))
                      .slice(0, 6)
                      .map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Soft Skills ({softSkillsMatch}% match)
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Found in Resume:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resumeKeywords.soft.slice(0, 6).map((keyword, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Missing from Job Description:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobKeywords.soft
                      .filter((k) => !resumeKeywords.soft.some((r) => r.includes(k) || k.includes(r)))
                      .slice(0, 4)
                      .map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Terms */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Industry Terms ({industryMatch}% match)
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Found in Resume:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resumeKeywords.industry.slice(0, 6).map((keyword, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Missing from Job Description:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobKeywords.industry
                      .filter((k) => !resumeKeywords.industry.some((r) => r.includes(k) || k.includes(r)))
                      .slice(0, 4)
                      .map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
