"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MainMenu from "./components/main-menu";
import MenuTitle from "./components/menu-title";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MenuIcon, Loader2 } from "lucide-react"; // Import Loader2
import { Skeleton } from "./components/dashboard-skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use useSession to check the session
  const { data: session, status } = useSession();

  useEffect(() => {
    // If the session is not loading and there's no session, redirect to login
    if (status !== "loading" && !session) {
      redirect("/login");
    }
  }, [session, status]);

if (status === "loading") {
  return (
    <div className="md:grid md:grid-cols-[250px_1fr] h-screen">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col p-4 gap-4 border-r border-border">
        <Skeleton className="h-8 w-24" /> {/* Menu Title Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" /> {/* Menu Item Skeleton */}
          <Skeleton className="h-10 w-full" /> {/* Menu Item Skeleton */}
          <Skeleton className="h-10 w-full" /> {/* Menu Item Skeleton */}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="overflow-auto py-2 px-4">
        <Skeleton className="h-8 w-48 mb-4" /> {/* Welcome Message Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" /> {/* Content Skeleton */}
          <Skeleton className="h-96 w-full" /> {/* Content Skeleton */}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="md:grid md:grid-cols-[250px_1fr] h-screen">
      <MainMenu className="hidden md:flex" />
      {!isDesktop && (
        <div className="p-4 flex justify-between md:hidden sticky top-0 left-0 bg-background border-b border-border">
          <MenuTitle />
          <Drawer
            direction="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            onOpenChange={(open) => setMobileMenuOpen(open)}
          >
            <DrawerTrigger>
              <MenuIcon />
            </DrawerTrigger>
            <DrawerContent>
              <MainMenu />
            </DrawerContent>
          </Drawer>
        </div>
      )}
      <div className="overflow-auto py-2 px-4">
        <h1 className="pb-4">Welcome back, {session?.user?.name || "User"}!</h1>
        {children}
      </div>
    </div>
  );
}
