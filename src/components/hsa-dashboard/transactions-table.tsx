"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Eye,
  MoreHorizontal,
  Receipt,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";

import type { Transaction } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ViewReceiptDialog } from "./view-receipt-dialog";

interface TransactionsTableProps {
  onToggleWithdrawn: (id: string, withdrawn: boolean) => void;
  transactions: Transaction[];
}

export const TransactionsTable = ({
  onToggleWithdrawn,
  transactions,
}: TransactionsTableProps) => {
  const [viewingReceipt, setViewingReceipt] = useState<null | Transaction>(
    null,
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Amount</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Receipt</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ?
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={7}>
                  No transactions found.
                </TableCell>
              </TableRow>
            : transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={
                      transaction.type === "deposit" ?
                        "text-green-600 dark:text-green-400"
                      : ""
                    }
                  >
                    <div className="flex items-center gap-1">
                      {transaction.type === "deposit" ?
                        <ArrowDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                      : <ArrowUp className="h-3 w-3" />}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        transaction.type === "deposit" ? "outline" : "secondary"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.type === "expense" ?
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={transaction.withdrawn}
                          onCheckedChange={(checked) => {
                            onToggleWithdrawn(transaction.id, checked === true);
                          }}
                        />
                        <span className="text-xs">
                          {transaction.withdrawn ? "Withdrawn" : "Unclaimed"}
                        </span>
                      </div>
                    : <span className="text-xs text-muted-foreground">N/A</span>
                    }
                  </TableCell>
                  <TableCell>
                    {transaction.receiptUrl ?
                      <Button
                        className="h-8 w-8"
                        onClick={() => {
                          setViewingReceipt(transaction);
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <Receipt className="h-4 w-4" />
                        <span className="sr-only">View receipt</span>
                      </Button>
                    : <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-8 w-8" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {transaction.receiptUrl ?
                          <DropdownMenuItem
                            onClick={() => {
                              setViewingReceipt(transaction);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Receipt
                          </DropdownMenuItem>
                        : null}
                        {transaction.type === "expense" && (
                          <DropdownMenuItem
                            onClick={() => {
                              onToggleWithdrawn(
                                transaction.id,
                                !transaction.withdrawn,
                              );
                            }}
                          >
                            {transaction.withdrawn ?
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Mark as Unclaimed
                              </>
                            : <>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Withdrawn
                              </>
                            }
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      {viewingReceipt ?
        <ViewReceiptDialog
          onOpenChange={() => {
            setViewingReceipt(null);
          }}
          open={Boolean(viewingReceipt)}
          transaction={viewingReceipt}
        />
      : null}
    </Card>
  );
};
