import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import { Button } from "../ui/button";

export const LoginButton = () => (
  <>
    <SignedOut>
      <SignInButton>
        <Button variant="outline">
          <LogIn className="h-4 w-4 text-primary" />
          <span>Login</span>
        </Button>
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </>
);
