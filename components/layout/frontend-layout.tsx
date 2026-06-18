"use client"

import type React from "react"
import { Suspense, lazy } from "react"
import { usePathname } from "next/navigation"
import MegaMenuHeader from "./mega-menu-header"
import NavigationProgress from "./navigation-progress"
import RoutePrefetcher from "./route-prefetcher"
import { Toaster } from "@/components/ui/sonner"

// Lazy load non-critical below-fold components
const Footer = lazy(() => import("./footer"))
const BottomNav = lazy(() => import("./bottom-nav"))
const WhatsAppButton = lazy(() => import("@/components/ui/whatsapp-button"))

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith("/admin") || 
                         pathname?.startsWith("/builder") || 
                         pathname?.startsWith("/buyer") || 
                         pathname?.startsWith("/dashboard") ||
                         pathname?.startsWith("/agent")
  
  // Don't render the mega menu header and footer for dashboard pages
  if (isDashboardPage) {
    return <>{children}</>
  }
  
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <RoutePrefetcher />
      <MegaMenuHeader />
      {children}
      <Suspense fallback={<div className="min-h-[600px] bg-gradient-to-b from-gray-50 to-white" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}
