"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Calendar,
  Clock,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileClient() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No user data found</h2>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-md space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <h1 className="font-playfair font-bold text-3xl">
                {user.displayName || user.username}
              </h1>
              {user.displayName && (
                <p className="text-muted-foreground text-lg">
                  @{user.username}
                </p>
              )}
              <Badge variant="secondary" className="px-3 py-1">
                Member since {formatDate(user.createdAt)}
              </Badge>
            </div>
          </div>

          {/* Profile Details Card */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="font-playfair font-bold text-xl">
                Profile Details
              </h2>
              <p className="text-muted-foreground text-sm">
                Your account information and details
              </p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{user.username}</p>
                </div>
              </div>

              {/* Display Name */}
              {user.displayName && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Display Name
                  </Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">{user.displayName}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              {/* Account Created */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Account Created
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Updated
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => {
                // Future: Navigate to edit profile page
                console.log("Edit profile clicked");
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>

            <Button
              variant="destructive"
              className="w-full h-12 text-base"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
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
