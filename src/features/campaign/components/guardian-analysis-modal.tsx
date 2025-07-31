"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import GuardianAnalysis from "./guardian-analysis";
import { GuardianAnalysisData } from "../api/get-guardian-analysis";

interface GuardianAnalysisModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  analysis: GuardianAnalysisData;
  onConfirm: () => void;
  onRetry: () => void;
}

const GuardianAnalysisModal = ({
  isOpen,
  onOpenChange,
  analysis,
  onConfirm,
  onRetry,
}: GuardianAnalysisModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Guardian Analysis Review</DialogTitle>
          <DialogDescription>
            Here is the private analysis of your campaign. You can choose to attach this to your
            campaign or go back and edit your description.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-1">
          <GuardianAnalysis analysis={analysis} />

          {/* Suggestions for improvement */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Suggestions for Improvement</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={onRetry}>
            Edit Description & Re-analyze
          </Button>
          <Button onClick={onConfirm}>Confirm and Use This Analysis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuardianAnalysisModal;
