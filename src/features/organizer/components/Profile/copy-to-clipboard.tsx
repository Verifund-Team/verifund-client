"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClipboardCopyProps {
  textToCopy: string | undefined;
  className?: string;
}

const formatAddress = (address: string, start = 6, end = 4) => {
  if (!address) return "";
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
};

const ClipboardCopy = ({ textToCopy, className }: ClipboardCopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!textToCopy) return;

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to cipy teks: " + err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <code className="text-xs bg-muted px-2 py-1 rounded">{formatAddress(textToCopy || "")}</code>
      <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!textToCopy}>
        {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </Button>
    </div>
  );
};

export default ClipboardCopy;
