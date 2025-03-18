"use client";

import type { Transaction } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import Image from "next/image";

interface ViewReceiptDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  transaction: Transaction;
}

export const ViewReceiptDialog = ({
  onOpenChange,
  open,
  transaction,
}: ViewReceiptDialogProps) => {
  if (!transaction.receiptUrl) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Receipt for {transaction.description}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">Date:</div>
            <div>{formatDate(transaction.date)}</div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">Amount:</div>
            <div>${transaction.amount.toFixed(2)}</div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Image
              alt={`Receipt for ${transaction.description}`}
              className="w-full object-contain"
              height={600}
              src={transaction.receiptUrl || "/placeholder.svg"}
              width={500}
            />
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
