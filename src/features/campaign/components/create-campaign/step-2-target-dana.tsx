"use client";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Step } from "@/components/ui/stepper";
import { AlertCircle } from "lucide-react";
import { formatIDRX } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Controller, useFormContext } from "react-hook-form";
import { CampaignFormSchema } from "../../api/create-campaign";

const DURATIONS = [
  { value: "0.00347", label: "5 Minutes (Test)" },
  { value: "1", label: "1 Day" },
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
  { value: "120", label: "120 Days" },
];

const StepTwoTargetDana = () => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<CampaignFormSchema>();
  const targetValue = watch("targetAmount");

  return (
    <Step>
      <CardTitle>Funding Target & Duration</CardTitle>
      <CardDescription>Set the funding target and duration for your campaign.</CardDescription>
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="target">Funding Target (IDRX) *</Label>
          <Input
            id="target"
            type="number"
            placeholder="Example: 1000000"
            {...register("targetAmount")}
            className="mt-1"
          />
          {targetValue && !errors.targetAmount && (
            <p className="text-sm text-muted-foreground mt-1">
              Target: {formatIDRX(Number.parseInt(targetValue) || 0)}
            </p>
          )}
          {errors.targetAmount && (
            <p className="text-sm text-destructive mt-1">{errors.targetAmount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="duration">Campaign Duration *</Label>
          <Controller
            control={control}
            name="durationInDays"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select campaign duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.durationInDays && (
            <p className="text-sm text-destructive mt-1">{errors.durationInDays.message}</p>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> The funding target and duration cannot be changed after the
            campaign is created. Please ensure the information you enter is correct.
          </AlertDescription>
        </Alert>
      </div>
    </Step>
  );
};
export default StepTwoTargetDana;
