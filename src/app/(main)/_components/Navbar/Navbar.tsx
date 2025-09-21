"use client";

import React from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import NavbarItem from "./_components/NavbarItem";
import VibeCoinDisplay from "./_components/VibeCoinDisplay";
import ProfileDropdown from "./_components/ProfileDropdown";
import MobileMenu from "./_components/MobileMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Bell, User } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Mock additional data that we don't have in the user model yet
  const notificationCount = 0; // TODO: Implement notification system
  const chatCount = 0; // TODO: Implement chat system
  const userCoins = 1247; // TODO: Add coins to user model or fetch separately

  // Don't render anything while loading
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
          </div>
        </div>
      </nav>
    );
  }

  // Prepare user data for components
  const userData = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.profilePicture || user.avatar || "",
        coins: userCoins,
        isOnline: user.isActive || false,
      }
    : null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:hidden flex items-center justify-between w-full">
            {isAuthenticated ? (
              <>
                <MobileMenu
                  userCoins={userData?.coins || 0}
                  notificationCount={notificationCount}
                  chatCount={chatCount}
                />

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Logo />
                </div>

                {userData && (
                  <ProfileDropdown
                    name={userData.name}
                    email={userData.email}
                    src={userData.avatar}
                    isOnline={userData.isOnline}
                  />
                )}
              </>
            ) : (
              <>
                <Logo />

                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-sans text-primary-700 hover:text-primary-800 hover:bg-primary-100"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-sans"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <VibeCoinDisplay coins={userData?.coins || 0} />

                  <Link href="/profile">
                    <NavbarItem
                      icon={<User className="w-5 h-5 text-foreground" />}
                      label="Profile"
                    />
                  </Link>

                  <Link href="/profile?tab=notifications">
                    <NavbarItem
                      icon={<Bell className="w-5 h-5 text-foreground" />}
                      label="Notifications"
                      badge={
                        notificationCount > 0 ? notificationCount : undefined
                      }
                    />
                  </Link>

                  <Link href="/chat">
                    <NavbarItem
                      icon={
                        <svg
                          className="w-5 h-5 text-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      }
                      label="Chats"
                      badge={chatCount > 0 ? chatCount : undefined}
                    />
                  </Link>

                  {userData && (
                    <ProfileDropdown
                      name={userData.name}
                      email={userData.email}
                      src={userData.avatar}
                      isOnline={userData.isOnline}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-6">
                      <Link
                        href="/about"
                        className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      >
                        About
                      </Link>
                      <Link
                        href="/find-match"
                        className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Find Match
                      </Link>
                      <Link
                        href="/pricing"
                        className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/contact-us"
                        className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Contact Us
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href="/login">
                        <Button
                          variant="ghost"
                          className="font-sans text-primary-700 hover:text-primary-800 hover:bg-primary-100"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white font-sans shadow-sm">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
