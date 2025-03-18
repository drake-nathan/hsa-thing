"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LoginButton = () => (
  <Button
    className="gap-2 bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-accent transition-all"
    size="sm"
    variant="outline"
  >
    <LogIn className="h-4 w-4 text-primary" />
    <span>Login</span>
  </Button>
);
