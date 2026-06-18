import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayoutWrapper from "@/components/dashboard/dashboard-layout-wrapper"

// Force dynamic rendering - auth-protected pages should never be cached
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Buyer Dashboard | CountryRoof",
  description: "Manage your properties and inquiries",
}

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (user.user_type !== "customer") {
    redirect("/")
  }

  return (
    <DashboardLayoutWrapper userRole="buyer" userName={user.username}>
      {children}
    </DashboardLayoutWrapper>
  )
}
