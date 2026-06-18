import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// Property type slug mapping
const PROPERTY_TYPE_MAP: Record<string, string[]> = {
  residential: ["apartment", "villa", "house", "flat", "penthouse", "duplex", "studio", "independent", "row house", "bungalow", "farmhouse"],
  commercial: ["office", "shop", "commercial", "showroom", "warehouse", "retail", "sco", "scf", "multiplex"],
  plots: ["plot", "land", "agricultural", "industrial land"],
}

function getPropertyTypeSlug(propertyType: string): string {
  if (!propertyType) return "residential"
  const lowerType = propertyType.toLowerCase()
  
  for (const [slug, types] of Object.entries(PROPERTY_TYPE_MAP)) {
    if (types.some(t => lowerType.includes(t))) {
      return slug
    }
  }
  return "residential"
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()
    
    const property = await db.collection("properties").findOne(
      { slug },
      { projection: { property_type: 1 } }
    )
    
    if (!property) {
      return NextResponse.json({ typeSlug: "residential" })
    }
    
    const typeSlug = getPropertyTypeSlug(property.property_type || "")
    
    return NextResponse.json({ typeSlug })
  } catch (error) {
    console.error("Error looking up property type:", error)
    return NextResponse.json({ typeSlug: "residential" })
  }
}
