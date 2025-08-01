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

    // 2. Prompt tetap sama, namun kita tidak perlu lagi meminta format JSON secara eksplisit di akhir.
    const prompt = `Anda adalah "Verifund Guardian", seorang analis risiko yang objektif dan membantu untuk platform crowdfunding.
Analisis deskripsi kampanye berikut dan berikan output HANYA dalam format JSON yang valid.

Kriteria Penilaian:
1. **credibilityScore (Angka 0-100):** Nilai tinggi jika tujuan jelas, spesifik, ada detail angka, dan terasa tulus. Nilai rendah jika terlalu umum, ambigu, atau tidak masuk akal.
2. **riskLevel (String):** Pilih salah satu dari: "Rendah", "Sedang", atau "Tinggi". Risiko tinggi jika ada tanda bahaya seperti janji keuntungan finansial, bahasa yang terlalu mendesak, atau kurangnya detail krusial.
3. **summary (String):** Satu kalimat ringkasan analisis Anda yang netral dan informatif.
4. **suggestions (Array of Strings):** Satu atau dua saran konkret dan membangun yang bisa membantu penulis meningkatkan kejelasan dan kepercayaan deskripsinya.

Deskripsi Kampanye: "${description}"`;

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
      console.error("Failed to parse AI response as JSON (even with JSON Mode):", text);

      // Fallback jika terjadi error yang sangat jarang
      return NextResponse.json({
        credibilityScore: 50,
        riskLevel: "Sedang",
        summary: "Analisis otomatis gagal, silakan periksa deskripsi kampanye Anda.",
        suggestions: [
          "Pastikan deskripsi kampanye Anda jelas dan spesifik",
          "Sertakan detail yang konkret tentang tujuan kampanye",
        ],
      });
    }
  } catch (error) {
    console.error("Error analyzing campaign:", error);
    return NextResponse.json({ error: "Failed to analyze campaign" }, { status: 500 });
  }
}
