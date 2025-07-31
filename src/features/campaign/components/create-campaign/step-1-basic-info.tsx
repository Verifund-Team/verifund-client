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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { CampaignFormSchema } from "../../api/create-campaign";
import Image from "next/image";

export const CATEGORIES = [
  "Education",
  "Health",
  "Religion",
  "Humanitarian",
  "Technology",
  "Economy",
  "Environment",
  "Sports",
  "Arts & Culture",
  "Other",
];

const StepOneBasicInfo = () => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CampaignFormSchema>();
  const image = watch("image");
  const descriptionLength = watch("description")?.length || 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    // @ts-expect-error: undefined is not type of file.
    setValue("image", undefined, { shouldValidate: true });
  };

  return (
    <Step>
      <CardTitle>Basic Campaign Information</CardTitle>
      <CardDescription>Enter the basic details for your campaign.</CardDescription>
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="creatorName">Creator Name *</Label>
          <Input
            id="creatorName"
            placeholder="Enter your name or organization"
            {...register("creatorName")}
            className="mt-1"
          />
          {errors.creatorName && (
            <p className="text-sm text-destructive mt-1">{errors.creatorName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="name">Campaign Title *</Label>
          <Input
            id="name"
            placeholder="Enter an engaging title for your campaign"
            {...register("name")}
            className="mt-1"
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Campaign Description *</Label>
          <Textarea
            id="description"
            placeholder="Tell the story of your campaign..."
            {...register("description")}
            className="mt-1 min-h-[200px]"
          />
          <p
            className={`text-sm mt-1 ${
              descriptionLength < 20 ? "text-muted-foreground" : "text-green-600"
            }`}
          >
            Minimum 20 characters ({descriptionLength}/20)
          </p>
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a campaign category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label>Campaign Image *</Label>
          <div className="mt-2 space-y-4">
            {!image ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop an image or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Select Image
                  </label>
                </Button>
              </div>
            ) : (
              <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-7 h-7 p-0"
                  onClick={removeImage}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {errors.image && <p className="text-sm text-destructive mt-1">{errors.image.message}</p>}
        </div>
      </div>
    </Step>
  );
};
export default StepOneBasicInfo;
