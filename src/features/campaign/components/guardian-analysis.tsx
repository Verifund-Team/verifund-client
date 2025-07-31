"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, TrendingUp, TrendingDown, AlertCircle, Bot } from "lucide-react";
import { GuardianAnalysisData } from "../api/get-guardian-analysis";

const getRiskLevelProps = (level: GuardianAnalysisData["riskLevel"]) => {
  switch (level) {
    case "Low":
      return {
        Icon: TrendingUp,
        className: "text-green-600 border-green-200 bg-green-50",
        title: "Low Risk",
        description: "This campaign shows positive indicators.",
      };
    case "Medium":
      return {
        Icon: AlertCircle,
        className: "text-yellow-600 border-yellow-200 bg-yellow-50",
        title: "Medium Risk",
        description: "Some factors require caution.",
      };
    case "High":
      return {
        Icon: TrendingDown,
        className: "text-red-600 border-red-200 bg-red-50",
        title: "High Risk",
        description: "This campaign has several risk factors.",
      };
    default:
      return {
        Icon: AlertCircle,
        className: "text-gray-600 border-gray-200 bg-gray-50",
        title: "Unknown Risk",
        description: "Risk level could not be determined.",
      };
  }
};

const getCredibilityScoreProps = (score: number) => {
  if (score >= 80) return { text: "Very Good Credibility", className: "text-green-600" };
  if (score >= 60) return { text: "Good Credibility", className: "text-yellow-600" };
  if (score >= 40) return { text: "Fair Credibility", className: "text-orange-600" };
  return { text: "Needs Improvement", className: "text-red-600" };
};

const GuardianAnalysis = ({ analysis }: { analysis: GuardianAnalysisData }) => {
  const riskProps = getRiskLevelProps(analysis.riskLevel);
  const scoreProps = getCredibilityScoreProps(analysis.credibilityScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Verifund Guardian Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Credibility Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${scoreProps.className}`}>
                  {scoreProps.text}
                </span>
                <span className="font-bold text-lg text-foreground">
                  {analysis.credibilityScore}/100
                </span>
              </div>
              <Progress value={analysis.credibilityScore} />
            </CardContent>
          </Card>

          <Card className={riskProps.className}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <riskProps.Icon className="w-4 h-4 mr-2" />
                {riskProps.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{riskProps.description}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold mb-2">AI Summary</h4>
          <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
            {analysis.summary}
          </p>
        </div>

        {/* Disclaimer */}
        <Alert variant="default" className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <Bot className="h-4 w-4 !text-yellow-800" />
          <AlertTitle>AI-Generated Analysis</AlertTitle>
          <AlertDescription className="text-xs text-yellow-700">
            This analysis is for informational purposes only. Please use your own judgment when
            making a donation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default GuardianAnalysis;
