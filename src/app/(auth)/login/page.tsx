"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the redirect URL from query parameters
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push(redirectTo);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        /* Hide scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for Firefox */
        html {
          scrollbar-width: none;
        }

        /* Hide scrollbar for IE/Edge */
        body {
          -ms-overflow-style: none;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-primary-100 dark:from-background dark:via-card dark:to-primary-950 flex items-center justify-center p-3">
        <div className="w-full max-w-4xl bg-card/95 dark:bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border dark:border-border overflow-hidden relative">
          <div className="flex flex-col lg:flex-row relative z-10">
            <div className="hidden lg:block lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200/50 via-primary-50/40 to-primary-200/50 dark:from-primary-800/20 dark:via-primary-700/30 dark:to-primary-600/40"></div>
              <Image
                src="/assets/auth/login.png"
                alt="Login page illustration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={true}
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-card/95 dark:bg-card/95 backdrop-blur-sm rounded-xl p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Find Your Perfect Match
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with like-minded souls and build meaningful
                    relationships.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-6 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-6 animate-fade-in">
                  <div className="inline-flex items-center gap-1 mb-4 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h1 className="font-bold text-xl text-primary-600 dark:text-primary-400">
                      Soulara
                    </h1>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Sign in to continue your journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-500 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "w-full pl-10 pr-4 py-3.5 text-sm rounded-lg border-2",
                          "border-border dark:border-border",
                          "bg-background dark:bg-input text-foreground",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                          "transition-all duration-300",
                          "hover:border-muted-foreground",
                          "min-h-[48px]",
                        )}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-500 transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "w-full pl-10 pr-10 py-3.5 text-sm rounded-lg border-2",
                          "border-border dark:border-border",
                          "bg-background dark:bg-input text-foreground",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                          "transition-all duration-300",
                          "hover:border-muted-foreground",
                          "min-h-[48px]",
                        )}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="w-4 h-4 text-primary-500 bg-background border-border rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 text-sm text-muted-foreground"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full py-3.5 px-4 text-sm rounded-lg font-medium",
                      "bg-primary hover:bg-primary-600 text-primary-foreground",
                      "shadow-md hover:shadow-lg",
                      "focus:ring-2 focus:ring-primary-500/25 focus:outline-none",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200",
                      "min-h-[48px]",
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Signing you in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center text-white justify-center gap-2">
                        Sign In
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-primary" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-4 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full py-3.5 px-4 rounded-lg",
                      "border-border hover:bg-accent",
                      "transition-all duration-200",
                      "min-h-[48px]"
                    )}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button> */}
                  <div>
                    <GoogleLogin
                      size="large"
                      width="100%"
                      theme="filled_blue"
                      onError={() => {
                        toast.error("Google signup failed!!!");
                      }}
                      onSuccess={async (
                        credentialResponse: CredentialResponse,
                      ) => {
                        if (credentialResponse.credential) {
                          try {
                            setIsLoading(true);
                            await googleLogin(credentialResponse.credential);
                            toast.success("Login successful!");
                            router.push(redirectTo);
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Google login failed",
                            );
                            toast.error("Google login failed");
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                    />
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    New to Soulara?{" "}
                    <Link
                      href="/signup"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors relative group"
                    >
                      Create an account
                      <span className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Enhanced focus styles */
        .group:focus-within .w-5.h-5 {
          color: rgb(244 63 94);
        }
      `}</style>
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
