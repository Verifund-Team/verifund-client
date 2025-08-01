import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const generationConfig: GenerationConfig = {
      responseMimeType: "application/json",
    };

    const prompt = `You are "Verifund Guardian", an objective and helpful risk analyst for a crowdfunding platform.
Analyze the following campaign description and provide the output ONLY in a valid JSON format.

Evaluation Criteria:
1. **credibilityScore (Number 0-100):** A high score for clear, specific goals, numerical details, and a sincere tone. A low score for being too general, ambiguous, or nonsensical.
2. **riskLevel (String):** Choose one of: "Low", "Medium", or "High". High risk for red flags like promises of financial return, overly urgent language, or lack of crucial details.
3. **summary (String):** A single, neutral, and informative sentence summarizing your analysis.
4. **suggestions (Array of Strings):** One or two concrete, constructive suggestions to help the author improve the clarity and trustworthiness of their description.

Campaign Description: "${description}"`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    console.log("AI response with JSON Mode:", text);

    try {
      const analysisResult = JSON.parse(text);

      if (
        !analysisResult.credibilityScore ||
        !analysisResult.riskLevel ||
        !analysisResult.summary ||
        !analysisResult.suggestions
      ) {
        throw new Error("Invalid analysis structure from AI");
      }

      return NextResponse.json(analysisResult);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON (even with JSON Mode):", text, parseError);

      // Fallback in case of a rare parsing error
      return NextResponse.json({
        credibilityScore: 50,
        riskLevel: "Medium",
        summary: "Automated analysis failed. Please review your campaign description.",
        suggestions: [
          "Ensure your campaign description is clear and specific.",
          "Include concrete details about the campaign's goals.",
        ],
      });
    }
  } catch (error) {
    console.error("Error analyzing campaign:", error);
    return NextResponse.json({ error: "Failed to analyze campaign" }, { status: 500 });
  }
}
