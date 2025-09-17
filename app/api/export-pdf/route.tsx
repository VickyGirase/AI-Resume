import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

interface GeneratedContent {
  summary: string
  bullets: string[]
  keywords: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { content, template }: { content: GeneratedContent; template: string } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const isModern = template === "modern"

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${isModern ? "'Arial', sans-serif" : "'Times New Roman', serif"};
            line-height: 1.6;
            color: #374151;
            background: white;
            padding: 40px;
            font-size: 14px;
        }
        
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: ${isModern ? "3px solid #059669" : "1px solid #d1d5db"};
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .header p {
            color: #6b7280;
            font-size: 14px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 12px;
            ${
              isModern
                ? "color: #059669; border-left: 4px solid #059669; padding-left: 12px;"
                : "border-bottom: 1px solid #d1d5db; padding-bottom: 4px;"
            }
        }
        
        .summary {
            text-align: justify;
            line-height: 1.7;
        }
        
        .experience-item {
            margin-bottom: 20px;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .job-title {
            font-weight: bold;
            color: #1f2937;
            font-size: 16px;
        }
        
        .company {
            color: #6b7280;
            font-size: 14px;
        }
        
        .date {
            color: #6b7280;
            font-size: 14px;
        }
        
        .bullets {
            margin-left: 20px;
        }
        
        .bullets li {
            margin-bottom: 4px;
            line-height: 1.5;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            ${
              isModern
                ? "background-color: rgba(5, 150, 105, 0.1); color: #059669;"
                : "background-color: #f3f4f6; color: #6b7280;"
            }
        }
        
        .education-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .degree {
            font-weight: bold;
            color: #1f2937;
        }
        
        .university {
            color: #6b7280;
            font-size: 14px;
        }
        
        @media print {
            body {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Your Name</h1>
        <p>your.email@example.com | (555) 123-4567 | LinkedIn Profile</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary">${content.summary}</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        <div class="experience-item">
            <div class="experience-header">
                <div>
                    <div class="job-title">Your Job Title</div>
                    <div class="company">Company Name</div>
                </div>
                <div class="date">2020 - Present</div>
            </div>
            <ul class="bullets">
                ${content.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Key Skills</h2>
        <div class="skills">
            ${content.keywords.map((keyword) => `<span class="skill-tag">${keyword}</span>`).join("")}
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Education</h2>
        <div class="education-item">
            <div>
                <div class="degree">Your Degree</div>
                <div class="university">University Name</div>
            </div>
            <div class="date">Graduation Year</div>
        </div>
    </div>
</body>
</html>
`

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    })

    await browser.close()

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
