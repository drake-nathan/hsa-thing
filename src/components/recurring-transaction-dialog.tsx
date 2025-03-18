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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface RecurringTransactionDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const RecurringTransactionDialog = ({
  onOpenChange,
  open,
}: RecurringTransactionDialogProps) => {
  const [amount, setAmount] = useState("150");
  const [frequency, setFrequency] = useState("biweekly");
  const [enabled, setEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this recurring transaction
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recurring Transaction</DialogTitle>
          <DialogDescription>
            Set up automatic recurring deposits to your HSA account.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 py-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring-enabled">
                Enable recurring deposits
              </Label>
              <Switch
                checked={enabled}
                id="recurring-enabled"
                onCheckedChange={setEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring-amount">Amount ($)</Label>
              <Input
                disabled={!enabled}
                id="recurring-amount"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring-frequency">Frequency</Label>
              <Select
                disabled={!enabled}
                onValueChange={setFrequency}
                value={frequency}
              >
                <SelectTrigger id="recurring-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 text-sm">
              <div className="font-medium">Summary</div>
              <p className="text-muted-foreground">
                {enabled ?
                  `$${amount} will be automatically deposited ${frequency === "biweekly" ? "every 2 weeks" : frequency}.`
                : "Recurring deposits are currently disabled."}
              </p>
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
            <Button type="submit">Save Settings</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
