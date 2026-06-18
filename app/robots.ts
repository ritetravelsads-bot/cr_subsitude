import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/agent", "/dashboard", "/api"],
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
      },
      {
        userAgent: "MJ12bot",
        allow: "/",
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
      },
    ],
    sitemap: "https://countryroof.in/sitemap.xml",
  }
}
