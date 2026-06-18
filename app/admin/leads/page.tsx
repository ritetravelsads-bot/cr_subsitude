import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import AdminLeadsList from "@/components/admin/leads-list"

export const metadata: Metadata = {
  title: "Lead Management | CountryRoof Admin",
  description: "Manage property enquiry leads, assign to agents, and track conversions",
}

export default async function LeadsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-sm text-muted-foreground">
            Track property enquiries, assign leads to agents, and monitor conversion rates
          </p>
        </div>

        <AdminLeadsList />
      </div>
    </div>
  )
}
