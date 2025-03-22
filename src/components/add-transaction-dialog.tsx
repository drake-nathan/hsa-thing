"use client";

import type { Transaction } from "@/lib/types";
import type React from "react";

import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";
import { useState } from "react";

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Transaction) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const AddTransactionDialog = ({
  onAddTransaction,
  onOpenChange,
  open,
}: AddTransactionDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"deposit" | "expense">("expense");
  const [withdrawn, setWithdrawn] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would upload the receipt file to a storage service
    // and get back a URL. For this demo, we'll use a placeholder.
    const receiptUrl =
      receiptFile ? "/placeholder.svg?height=300&width=300" : null;

    const newTransaction: Transaction = {
      amount: Number.parseFloat(amount),
      date: new Date(date ?? ""),
      description,
      id: Date.now().toString(),
      receiptUrl,
      type,
      withdrawn: type === "expense" ? withdrawn : false,
    };

    onAddTransaction(newTransaction);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setType("expense");
    setWithdrawn(false);
    setReceiptFile(null);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to your HSA account.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 py-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  required
                  type="date"
                  value={date}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Enter transaction description"
                required
                value={description}
              />
            </div>

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                className="flex space-x-4"
                onValueChange={(value) => {
                  setType(value as "deposit" | "expense");
                }}
                value={type}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="expense" value="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="deposit" value="deposit" />
                  <Label htmlFor="deposit">Deposit</Label>
                </div>
              </RadioGroup>
            </div>

            {type === "expense" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={withdrawn}
                    id="withdrawn"
                    onCheckedChange={(checked) => {
                      setWithdrawn(checked === true);
                    }}
                  />
                  <Label htmlFor="withdrawn">Mark as withdrawn</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Upload Receipt (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      className="w-full h-20 flex flex-col items-center justify-center border-dashed"
                      onClick={() =>
                        document.getElementById("receipt")?.click()
                      }
                      type="button"
                      variant="outline"
                    >
                      <Upload className="h-6 w-6 mb-1" />
                      <span>
                        {receiptFile ? receiptFile.name : "Click to upload"}
                      </span>
                      <input
                        accept="image/*"
                        className="hidden"
                        id="receipt"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setReceiptFile(e.target.files[0]);
                          }
                        }}
                        type="file"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
