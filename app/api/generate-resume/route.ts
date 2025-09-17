import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables in Project Settings.",
        },
        { status: 500 },
      )
    }

    const { experience, jobDescription } = await request.json()

    if (!experience?.trim()) {
      return NextResponse.json({ error: "Experience is required" }, { status: 400 })
    }

    const openaiClient = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
    const modelId = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

    // Generate professional summary
    const summaryPrompt = `
You are a professional resume writer. Create a compelling professional summary based on the following experience.

Experience: ${experience}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Requirements:
- 2-3 sentences maximum
- Highlight key achievements and skills
- Use action-oriented language
- Include relevant keywords from job description if provided
- Focus on value proposition

Return only the professional summary text, no additional formatting.
`

    const { text: summary } = await generateText({
      model: openaiClient(modelId),
      prompt: summaryPrompt,
      temperature: 0.7,
    })

    // Generate optimized bullet points
    const bulletsPrompt = `
You are a professional resume writer. Transform the following experience into 4-6 powerful bullet points using the STAR method (Situation, Task, Action, Result).

Experience: ${experience}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Requirements:
- Start each bullet with a strong action verb
- Include specific metrics and numbers where possible
- Use STAR method structure
- Optimize for ATS keywords from job description if provided
- Each bullet should be 1-2 lines maximum
- Focus on achievements, not just responsibilities

Return only the bullet points as a JSON array of strings, no additional formatting.
`

    const { text: bulletsText } = await generateText({
      model: openaiClient(modelId),
      prompt: bulletsPrompt,
      temperature: 0.7,
    })

    // Parse bullets from AI response
    let bullets: string[]
    try {
      bullets = JSON.parse(bulletsText)
    } catch {
      // Fallback: split by bullet points or newlines
      bullets = bulletsText
        .split(/[•\n]/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0)
        .slice(0, 6)
    }

    // Extract keywords
    const keywordsPrompt = `
Extract the most important professional keywords and skills from the following content. Focus on technical skills, tools, methodologies, and industry terms.

Experience: ${experience}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Requirements:
- Return 8-12 relevant keywords
- Include technical skills, tools, and methodologies
- Prioritize keywords from job description if provided
- Use industry-standard terminology
- Avoid generic words like "team" or "work"

Return only a JSON array of keyword strings, no additional formatting.
`

    const { text: keywordsText } = await generateText({
      model: openaiClient(modelId),
      prompt: keywordsPrompt,
      temperature: 0.3,
    })

    // Parse keywords from AI response
    let keywords: string[]
    try {
      keywords = JSON.parse(keywordsText)
    } catch {
      // Fallback: split by commas and clean up
      keywords = keywordsText
        .split(/[,\n]/)
        .map((k) => k.trim().replace(/['"]/g, ""))
        .filter((k) => k.length > 0)
        .slice(0, 12)
    }

    return NextResponse.json({
      summary: summary.trim(),
      bullets,
      keywords,
    })
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate resume content",
      },
      { status: 500 },
    )
  }
}
