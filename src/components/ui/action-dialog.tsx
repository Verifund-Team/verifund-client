"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface ActionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  status: "success" | "error";
  title: string;
  description: string;
  txHash?: string;
}

export const ActionDialog = ({
  isOpen,
  onOpenChange,
  status,
  title,
  description,
  txHash,
}: ActionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {status === "success" ? (
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 mr-2 text-red-500" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {description}
            {txHash && (
              <p className="mt-2 text-xs text-muted-foreground break-all">
                Tx Hash:{" "}
                <Link
                  href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {txHash}
                </Link>
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
