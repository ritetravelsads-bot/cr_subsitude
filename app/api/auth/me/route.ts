import { getCurrentUser } from "@/lib/auth"

// Force dynamic - never cache auth endpoints
export const dynamic = "force-dynamic"
export const revalidate = 0

// Common headers for auth responses - prevent any caching
// Vary: Cookie ensures responses are unique per user's cookies (prevents session sharing)
const noCacheHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
  "Vary": "Cookie",
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    // Return 200 with user: null instead of 401 to avoid console errors
    // This is a common pattern for auth check endpoints
    if (!user) {
      return new Response(JSON.stringify({ success: true, user: null }), {
        status: 200,
        headers: noCacheHeaders,
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          profile_picture: user.profile_picture,
        },
      }),
      {
        status: 200,
        headers: noCacheHeaders,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, user: null, error: "Internal server error" }), {
      status: 500,
      headers: noCacheHeaders,
    })
  }
}
