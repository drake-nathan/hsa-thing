"use client";

import { Clock, PiggyBank, Plus } from "lucide-react";

import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HSABalanceProps {
  balance: number;
  onOpenRecurring: () => void;
  unclaimedBalance: number;
}

export const HSABalance = ({
  balance,
  onOpenRecurring,
  unclaimedBalance,
}: HSABalanceProps) => {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(balance);

  const formattedUnclaimed = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(unclaimedBalance);

  const yearlyContribution = 3650;
  const contributionProgress = Math.min(
    100,
    (balance / yearlyContribution) * 100,
  );

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-card/80 to-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>HSA Balance</span>
          <Button
            className="h-8 gap-1 text-xs font-normal"
            onClick={onOpenRecurring}
            size="sm"
            variant="ghost"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Recurring</span>
          </Button>
        </CardTitle>
        <CardDescription>Your health savings account</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-1 flex items-baseline">
          <div className="text-4xl font-bold tracking-tight">
            {formattedBalance}
          </div>
          <div className="ml-2 text-sm text-muted-foreground">available</div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <div className="text-muted-foreground">Yearly contribution</div>
              <div className="font-medium">
                {contributionProgress.toFixed(0)}%
              </div>
            </div>
            <div className="relative">
              <Progress className="h-2" value={contributionProgress} />
              <div className="absolute -top-1 left-0 flex w-full justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>${yearlyContribution}</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center justify-between rounded-lg p-3",
              "border border-primary/10 bg-primary/5",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <PiggyBank className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Unclaimed Balance</div>
                <div className="text-xs text-muted-foreground">
                  Eligible for withdrawal
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold">{formattedUnclaimed}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          <span>Add Funds</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
