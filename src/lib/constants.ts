import { BadgeProps } from "@/components/ui/badge";

export const IMAGE_PLACEHOLDER = "/no-image.jpg";

export const CAMPAIGN_STATUS_CONFIG: {
  [key: number]: { text: string; variant: BadgeProps["variant"] };
} = {
  0: { text: "Aktif", variant: "default" },
  1: { text: "Selesai", variant: "secondary" },
  2: { text: "Gagal", variant: "destructive" },
};
