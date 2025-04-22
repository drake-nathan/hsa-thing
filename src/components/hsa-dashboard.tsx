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
import { api } from "@/trpc/react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  PlusCircle,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

// Utility function to convert API date string to client date consistently
const parseDate = (dateString: Date | string): Date => {
  if (dateString instanceof Date) return dateString;
  return new Date(dateString);
};

export const HSADashboard = () => {
  const [balance, setBalance] = useState(0);
  const [unclaimedBalance, setUnclaimedBalance] = useState(0);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);

  // Fetch transactions from API
  const { data: apiTransactions, refetch } =
    api.hsaTransaction.getAll.useQuery();

  // Client-side only data handling to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use useMemo to avoid dependency issues with useEffect
  const transactions = React.useMemo(() => {
    if (localTransactions.length > 0) return localTransactions;

    if (!isClient || !apiTransactions) return [];

    return apiTransactions.map((transaction) => ({
      amount: transaction.amount,
      date: parseDate(transaction.date),
      description: transaction.description,
      id: transaction.id,
      receiptUrl: transaction.receiptUrl,
      type: transaction.type.toLowerCase() as "deposit" | "expense",
      withdrawn: transaction.withdrawn,
    }));
  }, [apiTransactions, localTransactions, isClient]);

  // Calculate balances based on transactions
  useEffect(() => {
    if (transactions.length > 0) {
      let newBalance = 0;
      let newUnclaimedBalance = 0;

      transactions.forEach((transaction) => {
        if (transaction.type === "deposit") {
          newBalance += transaction.amount;
        } else {
          // Type must be "expense" if not "deposit"
          const isWithdrawn = transaction.withdrawn;
          if (isWithdrawn) {
            newBalance -= transaction.amount;
          } else {
            newUnclaimedBalance += transaction.amount;
          }
        }
      });

      setBalance(newBalance);
      setUnclaimedBalance(newUnclaimedBalance);
    }
  }, [transactions]);

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddWithdrawOpen, setIsAddWithdrawOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

  const createTransaction = api.hsaTransaction.create.useMutation({
    onSuccess: () => void refetch(),
  });

  const updateTransaction = api.hsaTransaction.update.useMutation({
    onSuccess: () => void refetch(),
  });

  const handleAddTransaction = (transaction: Transaction) => {
    // Call API to create transaction
    createTransaction.mutate({
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      receiptUrl: transaction.receiptUrl,
      type: transaction.type === "deposit" ? "deposit" : "expense",
      withdrawn: transaction.withdrawn,
    });

    // Add to local state for immediate UI update
    setLocalTransactions([...transactions, transaction]);

    // Recalculate balances
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
    // Find transaction to update
    const transaction = transactions.find(
      (t) => t.id === id && t.type === "expense",
    );

    if (transaction) {
      // Update in API
      updateTransaction.mutate({
        id,
        withdrawn,
      });

      // Update local state for immediate UI update
      const updatedTransactions = transactions.map((t) => {
        if (t.id === id && t.type === "expense") {
          if (withdrawn && !t.withdrawn) {
            // Marking as withdrawn
            setBalance(balance - t.amount);
            setUnclaimedBalance(unclaimedBalance - t.amount);
          } else if (!withdrawn && t.withdrawn) {
            // Unmarking as withdrawn
            setBalance(balance + t.amount);
            setUnclaimedBalance(unclaimedBalance + t.amount);
          }
          return { ...t, withdrawn };
        }
        return t;
      });

      setLocalTransactions(updatedTransactions);
    }
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
