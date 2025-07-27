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
  { value: "30", label: "30 Hari" },
  { value: "60", label: "60 Hari" },
  { value: "90", label: "90 Hari" },
  { value: "120", label: "120 Hari" },
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
      <CardTitle>Target Dana & Durasi</CardTitle>
      <CardDescription>Tentukan target dana dan durasi untuk kampanye Anda.</CardDescription>
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="target">Target Dana (IDRX) *</Label>
          <Input
            id="target"
            type="number"
            placeholder="Contoh: 1000000"
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
          <Label htmlFor="duration">Durasi Kampanye *</Label>
          <Controller
            control={control}
            name="durationInDays"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih durasi kampanye" />
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
            <strong>Penting:</strong> Target dana dan durasi tidak dapat diubah setelah kampanye
            dibuat. Pastikan informasi yang Anda masukkan sudah benar.
          </AlertDescription>
        </Alert>
      </div>
    </Step>
  );
};
export default StepTwoTargetDana;
