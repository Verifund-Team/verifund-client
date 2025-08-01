import { useMutation } from "@tanstack/react-query";

export interface GuardianAnalysisData {
  credibilityScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Rendah" | "Sedang" | "Tinggi";
  summary: string;
  suggestions: string[];
}

export function useGuardianAnalysis() {
  return useMutation<GuardianAnalysisData, Error, { description: string }>({
    mutationFn: async ({ description }) => {
      const response = await fetch("/api/guardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to get analysis from Guardian service.");
      }

      return response.json();
    },
  });
}
