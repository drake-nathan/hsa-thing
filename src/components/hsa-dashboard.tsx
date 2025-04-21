"use client";

import type { Transaction } from "@/lib/types";

import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { AddWithdrawDialog } from "@/components/add-withdraw-dialog";
import { HSABalance } from "@/components/hsa-balance";
import { RecurringTransactionDialog } from "@/components/recurring-transaction-dialog";
import { TransactionsTable } from "@/components/transactions-table";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportTransactionsToCSV } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

export const HSADashboard = () => {
  const [balance, setBalance] = useState(2500);
  const [unclaimedBalance, setUnclaimedBalance] = useState(1200);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      amount: 1500,
      date: new Date("2023-12-15"),
      description: "Annual contribution",
      id: "1",
      receiptUrl: null,
      type: "deposit",
      withdrawn: false,
    },
    {
      amount: 150,
      date: new Date("2023-12-20"),
      description: "Doctor visit",
      id: "2",
      receiptUrl: "/placeholder.svg?height=300&width=300",
      type: "expense",
      withdrawn: true,
    },
    {
      amount: 75,
      date: new Date("2024-01-05"),
      description: "Prescription",
      id: "3",
      receiptUrl: "/placeholder.svg?height=300&width=300",
      type: "expense",
      withdrawn: false,
    },
    {
      amount: 1000,
      date: new Date("2024-01-15"),
      description: "Employer contribution",
      id: "4",
      receiptUrl: null,
      type: "deposit",
      withdrawn: false,
    },
  ]);

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddWithdrawOpen, setIsAddWithdrawOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);

    if (transaction.type === "deposit") {
      setBalance(balance + transaction.amount);
    } else if (transaction.withdrawn) {
      setBalance(balance - transaction.amount);
    } else {
      setUnclaimedBalance(unclaimedBalance + transaction.amount);
    }
  };

  const handleAddWithdraw = (amount: number) => {
    setBalance(balance - amount);
    setUnclaimedBalance(unclaimedBalance - amount);
  };

  const handleToggleWithdrawn = (id: string, withdrawn: boolean) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === id && transaction.type === "expense") {
        if (withdrawn && !transaction.withdrawn) {
          // Marking as withdrawn
          setBalance(balance - transaction.amount);
          setUnclaimedBalance(unclaimedBalance - transaction.amount);
        } else if (!withdrawn && transaction.withdrawn) {
          // Unmarking as withdrawn
          setBalance(balance + transaction.amount);
          setUnclaimedBalance(unclaimedBalance + transaction.amount);
        }
        return { ...transaction, withdrawn };
      }
      return transaction;
    });

    setTransactions(updatedTransactions);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <HSABalance
          balance={balance}
          onOpenRecurring={() => {
            setIsRecurringOpen(true);
          }}
          unclaimedBalance={unclaimedBalance}
        />

        <Card className="overflow-hidden border-none bg-gradient-to-br from-card/80 to-card shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                className="group h-auto justify-start gap-3 py-4"
                onClick={() => {
                  setIsAddTransactionOpen(true);
                }}
              >
                <PlusCircle className="h-5 w-5 transition-colors group-hover:text-primary-foreground" />
                <div className="text-left">
                  <div className="font-medium">Add Transaction</div>
                  <div className="text-xs opacity-70 transition-colors group-hover:text-primary-foreground/80">
                    Record expenses with receipts
                  </div>
                </div>
              </Button>

              <Button
                className="group h-auto justify-start gap-3 border-primary/20 py-4 hover:border-primary"
                onClick={() => {
                  setIsAddWithdrawOpen(true);
                }}
                variant="outline"
              >
                <ArrowUpCircle className="h-5 w-5 text-primary transition-colors group-hover:text-primary" />
                <div className="text-left">
                  <div className="font-medium">Add Withdraw</div>
                  <div className="text-xs opacity-70">
                    Withdraw funds without receipt
                  </div>
                </div>
              </Button>

              <Button
                className="group h-auto justify-start gap-3 border-primary/20 py-4 hover:border-primary"
                onClick={() => {
                  setIsRecurringOpen(true);
                }}
                variant="outline"
              >
                <ArrowDownCircle className="h-5 w-5 text-primary transition-colors group-hover:text-primary" />
                <div className="text-left">
                  <div className="font-medium">Recurring Deposit</div>
                  <div className="text-xs opacity-70">
                    Set up automatic deposits
                  </div>
                </div>
              </Button>

              <Button
                className="group h-auto justify-start gap-3 border-primary/20 py-4 hover:border-primary"
                onClick={handleExportCSV}
                variant="outline"
              >
                <Download className="h-5 w-5 text-primary transition-colors group-hover:text-primary" />
                <div className="text-left">
                  <div className="font-medium">Export CSV</div>
                  <div className="text-xs opacity-70">
                    Download transaction history
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="w-full" defaultValue="all">
        <TabsList className="mb-6 grid w-full grid-cols-3 rounded-lg bg-muted/50 p-1">
          <TabsTrigger
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="all"
          >
            All Transactions
          </TabsTrigger>
          <TabsTrigger
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="expenses"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="deposits"
          >
            Deposits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionsTable
            onToggleWithdrawn={handleToggleWithdrawn}
            transactions={transactions}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <TransactionsTable
            onToggleWithdrawn={handleToggleWithdrawn}
            transactions={transactions.filter((t) => t.type === "expense")}
          />
        </TabsContent>

        <TabsContent value="deposits">
          <TransactionsTable
            onToggleWithdrawn={handleToggleWithdrawn}
            transactions={transactions.filter((t) => t.type === "deposit")}
          />
        </TabsContent>
      </Tabs>

      <AddTransactionDialog
        onAddTransaction={handleAddTransaction}
        onOpenChange={setIsAddTransactionOpen}
        open={isAddTransactionOpen}
      />

      <AddWithdrawDialog
        maxAmount={unclaimedBalance}
        onAddWithdraw={handleAddWithdraw}
        onOpenChange={setIsAddWithdrawOpen}
        open={isAddWithdrawOpen}
      />

      <RecurringTransactionDialog
        onOpenChange={setIsRecurringOpen}
        open={isRecurringOpen}
      />
    </div>
  );
};
