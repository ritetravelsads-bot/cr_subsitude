import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayoutWrapper from "@/components/dashboard/dashboard-layout-wrapper"

// Force dynamic rendering - auth-protected pages should never be cached
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Dashboard | CountryRoof",
  description: "Manage your properties and quotes",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Redirect to appropriate dashboard based on user type
  if (user.user_type === "admin") {
    redirect("/admin/dashboard")
  }

  if (user.user_type === "agent") {
    redirect("/agent/dashboard")
  }

  // For customers, show the buyer dashboard
  return (
    <DashboardLayoutWrapper userRole="customer" userName={user.username}>
      {children}
    </DashboardLayoutWrapper>
  )
}
