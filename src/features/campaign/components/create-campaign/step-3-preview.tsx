"use client";

import { Step } from "@/components/ui/stepper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { formatIDRX } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CampaignFormSchema } from "../../api/create-campaign";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { GuardianAnalysisData } from "../../api/get-guardian-analysis";
import GuardianAnalysis from "../guardian-analysis";

interface StepThreePreviewProps {
  finalAnalysis: GuardianAnalysisData | null;
}

const StepThreePreview = ({ finalAnalysis }: StepThreePreviewProps) => {
  const { watch } = useFormContext<CampaignFormSchema>();
  const formData = watch();

  return (
    <Step>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Campaign Preview</h3>

        <Card className="pt-0 overflow-hidden">
          <div className="relative w-full h-48">
            {formData.image ? (
              <Image
                src={URL.createObjectURL(formData.image)}
                alt="Campaign preview"
                className="object-cover"
                fill
                sizes="(max-width: 896px) 100vw, 896px"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image uploaded</p>
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-card/90 text-foreground" variant="secondary">
              {formData.category || "Category"}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="text-xl">{formData.name || "Your Campaign Title"}</CardTitle>
            <CardDescription className="whitespace-pre-line h-20 overflow-y-auto">
              {formData.description || "Your campaign description will appear here..."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-primary">IDRX 0</span>
                <span className="text-muted-foreground">
                  of {formatIDRX(Number.parseInt(formData.targetAmount) || 0)}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />0 donors
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formData.durationInDays || "0"} days
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                by {formData.creatorName || "Creator Name"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Funding Target:</span>
              <span className="font-medium">
                {formatIDRX(Number.parseInt(formData.targetAmount) || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{formData.durationInDays || "0"} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{formData.category || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {finalAnalysis && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Guardian Analysis Preview</h3>
            <GuardianAnalysis analysis={finalAnalysis} />
          </div>
        )}
      </div>
    </Step>
  );
};
export default StepThreePreview;
