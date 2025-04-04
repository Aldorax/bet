"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
};

export default function AccountPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchTransactions() {
      try {
        const response = await fetch("/api/account/transactions");
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
              <CardDescription>Your current simulation balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-8 w-8 mr-3 text-primary" />
                  <div className="text-3xl font-bold">
                    ${user.balance.toFixed(2)}
                  </div>
                </div>
                <Link href="/account/deposit">
                  <Button>Add Funds</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="font-medium">{user.username}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="pt-2">
                <Link href="/account/settings">
                  <Button variant="outline" size="sm">
                    Account Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Recent Transactions</h2>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center">
                      {transaction.amount > 0 ? (
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(transaction.createdAt),
                            { addSuffix: true }
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        transaction.amount > 0
                          ? "text-green-500 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
