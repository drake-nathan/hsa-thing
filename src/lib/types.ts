export interface Transaction {
  amount: number;
  date: Date;
  description: string;
  id: string;
  receiptUrl: null | string;
  type: "deposit" | "expense";
  withdrawn: boolean;
}

export interface RecurringTransaction {
  amount: number;
  enabled: boolean;
  frequency: "biweekly" | "monthly" | "quarterly" | "weekly";
  id: string;
}
