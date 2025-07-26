import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDRX(amount?: number) {
  if (!amount) {
    return "0 IDRX";
  }

  const formattedAmount = new Intl.NumberFormat("id-ID").format(amount);

  return `${formattedAmount} IDRX`;
}

export function formatAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function formatDate(date?: string) {
  if (!date) return "";
  return format(new Date(date), "d MMMM yyyy HH:mm", { locale: id });
}

export function createInputChangeHandler<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
  return (field: keyof T, value: string) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
}

export function isArrayLengthGreaterThanZero<T>(arr: T[] | undefined): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

export const formatTimeRemaining = (seconds: number) => {
  if (seconds <= 0) return "Berakhir";

  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);

  if (days > 0) return `${days} hari ${hours} jam`;
  return `${hours} jam`;
};

export const formatCompactNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} M`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)} Jt`;
  }
  return num.toString();
};
