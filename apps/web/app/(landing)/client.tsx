"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";

export default function LandingClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen w-[600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <UsersRound className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-playfair font-bold text-xl">Profile</span>
        </div>
        <ModeToggle />
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 text-center">
        <div className="max-w-md mx-auto space-y-8">
          {/* Hero Content */}
          <div className="space-y-4">
            <Badge variant="secondary" className="px-3 py-1">
              Modern Profile Sharing Experience
            </Badge>
            <h1 className="font-playfair font-bold text-4xl md:text-5xl leading-tight">
              Welcome to <span className="text-primary block">Profile</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Share your Profile, Experiences, Skills and Projects with people.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-y-3">
            <Link href={"/sign-up"}>
              <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={"/sign-in"}>
              <Button variant="outline" className="w-full h-12 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Profile. Crafted with precision and ❤️
        </p>
      </footer>
    </div>
  );
}
