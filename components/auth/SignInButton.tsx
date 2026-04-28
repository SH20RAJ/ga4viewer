"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  large?: boolean;
}

export function SignInButton({ large }: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      size={large ? "lg" : "default"}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Sign in with Google
    </Button>
  );
}
