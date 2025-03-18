"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AddWithdrawDialogProps {
  maxAmount: number;
  onAddWithdraw: (amount: number) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const AddWithdrawDialog = ({
  maxAmount,
  onAddWithdraw,
  onOpenChange,
  open,
}: AddWithdrawDialogProps) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddWithdraw(Number.parseFloat(amount));
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setAmount("");
    setNotes("");
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw funds from your HSA account without a receipt.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 py-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount ($)</Label>
              <Input
                id="withdraw-amount"
                max={maxAmount}
                min="0.01"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder="0.00"
                required
                step="0.01"
                type="number"
                value={amount}
              />
              <p className="text-xs text-muted-foreground">
                Maximum available: ${maxAmount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                placeholder="Add any notes about this withdrawal"
                rows={3}
                value={notes}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                onOpenChange(false);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !amount ||
                Number.parseFloat(amount) <= 0 ||
                Number.parseFloat(amount) > maxAmount
              }
              type="submit"
            >
              Withdraw Funds
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
