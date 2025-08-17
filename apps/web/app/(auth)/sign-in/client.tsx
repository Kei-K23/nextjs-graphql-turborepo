"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/generated-types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

// Zod validation schema
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInClient() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [loginMutation, { loading: loginMutationLoading, error }] =
    useLoginMutation();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { data } = await loginMutation({ variables: values });

      if (data?.login) {
        const { accessToken, refreshToken, user } = data.login;
        login(accessToken, refreshToken, user);
        router.push("/profile");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      // Error will be displayed by the form
    }
  };

  return (
    <div className="min-h-screen w-[600px] mx-auto flex flex-col">
      <header className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push("/");
          }}
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Button>
        <h1 className="font-playfair font-bold text-xl ml-4">Sign In</h1>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-playfair font-bold text-2xl">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12"
                        disabled={loginMutationLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="h-12"
                        disabled={loginMutationLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={loginMutationLoading}
              >
                {loginMutationLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
