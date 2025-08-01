"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn, formatAddress } from "@/lib/utils";
import { toast } from "sonner";

interface ClipboardCopyProps {
  textToCopy: string | undefined;
  className?: string;
}

const ClipboardCopy = ({ textToCopy, className }: ClipboardCopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);

      toast.success("Address copied to clipboard!");
      setIsCopied(true);

      // Reset the icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy address to clipboard.");
    }
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <code className="text-xs bg-muted px-2 py-1 rounded">{formatAddress(textToCopy || "")}</code>
      <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!textToCopy}>
        {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </Button>
    </div>
  );
};

export default ClipboardCopy;
