import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Transaction } from "./types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  // Convert transactions to CSV format
  const headers = [
    "Date",
    "Description",
    "Amount",
    "Type",
    "Status",
    "Receipt",
  ];

  const rows = transactions.map((transaction) => [
    transaction.date.toISOString().split("T")[0],
    transaction.description,
    transaction.amount.toString(),
    transaction.type,
    transaction.type === "expense" ?
      transaction.withdrawn ?
        "Withdrawn"
      : "Unclaimed"
    : "N/A",
    transaction.receiptUrl ? "Yes" : "No",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `hsa-transactions-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
