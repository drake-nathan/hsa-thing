"use client";

import { Button } from "@/components/ui/button/button";
import { LogIn } from "lucide-react";

export const LoginButton = () => (
  <Button
    className="gap-2 border border-border/40 bg-background/80 backdrop-blur-sm transition-all hover:bg-accent"
    size="sm"
    variant="outline"
  >
    <LogIn className="h-4 w-4 text-primary" />
    <span>Login</span>
  </Button>
);
