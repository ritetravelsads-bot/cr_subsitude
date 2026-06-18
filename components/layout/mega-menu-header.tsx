"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, User, ChevronDown, IndianRupee, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { BUDGET_RANGES } from "@/lib/utils"
import HeaderSearch from "./header-search"

interface CurrentUser {
  id: string
  email: string
  username: string
  user_type: "customer" | "agent" | "admin"
}

const locations = [
  { name: "Golf Course Road", href: "/golf-course-road", slug: "golf-course-road" },
  { name: "Golf Course Extn Road", href: "/golf-course-extn-road", slug: "golf-course-extn-road" },
  { name: "Dwarka Expressway", href: "/dwarka-expressway", slug: "dwarka-expressway" },
  { name: "Southern Peripheral Road", href: "/southern-peripheral-road", slug: "southern-peripheral-road" },
  { name: "Sohna", href: "/sohna", slug: "sohna" },
  { name: "New Gurgaon", href: "/new-gurgaon", slug: "new-gurgaon" },
  { name: "NH-48", href: "/nh-48", slug: "nh-48" },
  { name: "Manesar", href: "/manesar", slug: "manesar" },
]

const projects = [
  { name: "Ready To Move", href: "/ready-to-move", icon: "🏠" },
  { name: "New Launch", href: "/new-launch", icon: "✨" },
  { name: "Upcoming", href: "/upcoming", icon: "🔨" },
  { name: "Luxury Apartments", href: "/luxury-apartments", icon: "💎" },
  { name: "Plots and Lands", href: "/plots-and-lands", icon: "🏞️" },
  { name: "Office Spaces", href: "/office-space", icon: "🏢" },
  { name: "Commercial Properties", href: "/commercial-properties", icon: "🏢" },
  { name: "Furnished Flats", href: "/furnished-flats", icon: "🛋️" },
]

export default function MegaMenuHeader() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)


  useEffect(() => {
    setMounted(true)

    // Defer auth check to not block initial render
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { 
          credentials: "include",
          // IMPORTANT: Never cache auth responses - each user must get their own session
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          // API returns user: null for unauthenticated users
          if (data.user) {
            setCurrentUser(data.user)
          }
        }
      } catch {
        // Network error - user not logged in
      }
    }

    // Use requestIdleCallback to not block main thread
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(checkAuth)
    } else {
      setTimeout(checkAuth, 100)
    }
  }, [])



  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setCurrentUser(null)
    window.location.href = "/"
  }

  const getDashboardLink = () => {
    if (!currentUser) return "/dashboard"
    if (currentUser.user_type === "agent") return "/builder/dashboard"
    if (currentUser.user_type === "admin") return "/admin/dashboard"
    return "/buyer"
  }

  const getDashboardLabel = () => {
    if (!currentUser) return "My Dashboard"
    if (currentUser.user_type === "agent") return "Builder Dashboard"
    if (currentUser.user_type === "admin") return "Admin Dashboard"
    return "Buyer Dashboard"
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <nav className="flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Country Roof Logo"
              width={200}
              height={50}
              priority
              fetchPriority="high"
              className="h-10 w-auto md:h-12"
              style={{ width: "auto", height: "auto", maxHeight: "48px" }}
            />
          </Link>

          {/* Desktop Mega Menu Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors"
            >
              Home
            </Link>

            {/* Locations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Locations
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {locations.map((location) => (
                  <DropdownMenuItem key={location.name} asChild>
                    <Link href={location.href} className="w-full">
                      {location.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Projects Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  Projects
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {projects.map((project) => (
                  <DropdownMenuItem key={project.name} asChild>
                    <Link href={project.href} className="w-full">
                      {project.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Budget Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  Budget
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {BUDGET_RANGES.map((range) => (
                  <DropdownMenuItem key={range.value} asChild>
                    <Link 
                      href={`/properties?minPrice=${range.min}${range.max ? `&maxPrice=${range.max}` : ''}`}
                      className="w-full"
                    >
                      {range.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block relative">
            <HeaderSearch />
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {mounted ? (
              currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm h-9 border-[#002366] text-[#002366] bg-transparent"
                    >
                      <User size={16} className="mr-2" />
                      {currentUser.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>{getDashboardLabel()}</Link>
                    </DropdownMenuItem>
                    {currentUser.user_type === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">Admin Settings</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-sm h-9 border-[#002366] text-[#002366] bg-transparent hover:bg-[#002366]/5"
                  >
                    <Link href="/auth/login">Post Property</Link>
                  </Button>
                  <Button asChild size="sm" className="text-sm h-9 bg-[#002366] hover:bg-[#001a4d]">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </>
              )
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#002366] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto">
          <div className="flex flex-col gap-1 px-4 py-3">
            {/* Mobile Search Bar */}
            <div className="mb-3">
              <HeaderSearch />
            </div>

            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
            >
              Home
            </Link>

            <div className="border-t border-gray-100 my-2" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Locations</p>
            {locations.map((location) => (
              <Link
                key={location.name}
                href={location.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
              >
                {location.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Projects</p>
            {projects.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
              >
                {project.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2" />
            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Budget</p>
            {BUDGET_RANGES.map((range) => (
              <Link
                key={range.value}
                href={`/properties?minPrice=${range.min}${range.max ? `&maxPrice=${range.max}` : ''}`}
                className="px-3 py-2 text-sm text-gray-600 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
              >
                {range.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2" />
            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#002366] hover:bg-gray-50 rounded transition-colors"
            >
              Contact
            </Link>

            <div className="border-t border-gray-100 my-2" />
            {mounted && (
              <div className="flex gap-2 mt-3">
                {currentUser ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 flex-1 border-[#002366] text-[#002366] bg-transparent"
                    >
                      <Link href={getDashboardLink()}>{getDashboardLabel()}</Link>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      size="sm"
                      className="text-xs h-9 flex-1 bg-[#002366] hover:bg-[#001a4d]"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 flex-1 border-[#002366] text-[#002366] bg-transparent"
                    >
                      <Link href="/auth/login">Post Property</Link>
                    </Button>
                    <Button asChild size="sm" className="text-xs h-9 flex-1 bg-[#002366] hover:bg-[#001a4d]">
                      <Link href="/auth/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
