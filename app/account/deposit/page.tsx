"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateBalance } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/account/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          type: "deposit",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deposit funds");
      }

      const data = await response.json();
      updateBalance(data.newBalance);

      toast({
        title: "Deposit Successful",
        description: `$${amount.toFixed(2)} has been added to your account`,
      });

      addNotification({
        message: `You've successfully deposited $${amount.toFixed(2)}`,
        type: "success",
      });

      router.push("/account");
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "An error occurred while processing your deposit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>

          <Card>
            <CardHeader>
              <CardTitle>Add Simulation Funds</CardTitle>
              <CardDescription>
                Add funds to your account for simulation purposes. No real money
                is involved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="pl-7"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      onClick={() => setAmount(quickAmount)}
                      className={amount === quickAmount ? "border-primary" : ""}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleDeposit}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Deposit Funds"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>This is a simulation platform. No real money is used.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
